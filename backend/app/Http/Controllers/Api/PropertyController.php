<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Property;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\OpenAIService;

class PropertyController extends Controller
{
    /**
     * Convert search parameters to monthly equivalent
     */
    private function normalizeSearchPrice($price, $searchBillingCycle)
    {
        switch (strtolower($searchBillingCycle)) {
            case 'monthly':
                return (int)$price;
            case 'quarterly':
                return (int)($price / 3);
            case 'yearly':
                return (int)($price / 12);
            default:
                return (int)$price; // fallback to original price
        }
    }

    /**
     * Example of how the price comparison works:
     * 
     * Search: "max 100k yearly"
     * - Normalized to monthly: 100,000 / 12 = 8,333.33 monthly
     * 
     * Properties in database:
     * - Property A: 6,000 monthly (normalized: 6,000) ✓ MATCH (6,000 < 8,333.33)
     * - Property B: 15,000 quarterly (normalized: 15,000 / 3 = 5,000) ✓ MATCH (5,000 < 8,333.33)
     * - Property C: 120,000 yearly (normalized: 120,000 / 12 = 10,000) ✗ NO MATCH (10,000 > 8,333.33)
     */

    /**
     * Debug method to show price comparisons (can be used for testing)
     */
    public function debugPriceComparison($searchPrice, $searchBillingCycle)
    {
        $normalizedSearch = $this->normalizeSearchPrice($searchPrice, $searchBillingCycle);
        
        return [
            'search_criteria' => [
                'original_price' => $searchPrice,
                'billing_cycle' => $searchBillingCycle,
                'normalized_monthly' => $normalizedSearch
            ],
            'examples' => [
                'monthly_6000' => [
                    'original' => '6,000 monthly',
                    'normalized' => 6000,
                    'matches' => 6000 <= $normalizedSearch
                ],
                'quarterly_15000' => [
                    'original' => '15,000 quarterly',
                    'normalized' => 15000 / 3,
                    'matches' => (15000 / 3) <= $normalizedSearch
                ],
                'yearly_120000' => [
                    'original' => '120,000 yearly',
                    'normalized' => 120000 / 12,
                    'matches' => (120000 / 12) <= $normalizedSearch
                ]
            ]
        ];
    }

    // Get all properties with filtering
    public function index(Request $request)
    {
        $query = Property::with('owner')->where('is_available', true);

        // Filter by location
        if ($request->has('location')) {
            $locations = is_array($request->location) ? $request->location : explode(',', $request->location);
            $query->whereIn('location', $locations);
        }


        // if ($request->has('with_preferences') && $request->with_preferences === 'true') {
        //     $user = Auth::user();
        //     $culturalPreferences = $user->cultural_preferences;
        //     $query->whereJsonContains('cultural_preferences', $culturalPreferences);
        // }

        if ($request->has('address') && !empty($request->address)) {
            $address = $request->address;
            $query->where('address', 'like', '%' . $address . '%');
        }

        // Check if a string is contained in the description
        if ($request->has('description') && !empty($request->description)) {
            $desc = $request->description;
            $query->where('description', 'like', '%' . $desc . '%');
        }

        // Filter by property type
        if ($request->has('property_type')) {
            $query->where('property_type', $request->property_type);
        }

        // Filter by room type
        if ($request->has('room_type')) {
            $query->where('room_type', $request->room_type);
        }

        // Filter by price range with billing cycle normalization
        if ($request->has('min_price')) {
            $searchBillingCycle = $request->get('billing_cycle', 'monthly');
            $normalizedMinPrice = $this->normalizeSearchPrice($request->min_price, $searchBillingCycle);
            
            // Convert property prices to monthly equivalent for comparison
            $query->whereRaw('
                CASE 
                    WHEN LOWER(billing_cycle) = "monthly" THEN price
                    WHEN LOWER(billing_cycle) = "quarterly" THEN price / 3
                    WHEN LOWER(billing_cycle) = "yearly" THEN price / 12
                    ELSE price
                END >= ?
            ', [$normalizedMinPrice]);
        }
        
        if ($request->has('max_price')) {
            $searchBillingCycle = $request->get('billing_cycle', 'monthly');
            $normalizedMaxPrice = $this->normalizeSearchPrice($request->max_price, $searchBillingCycle);
            
            // Convert property prices to monthly equivalent for comparison
            $query->whereRaw('
                CASE 
                    WHEN LOWER(billing_cycle) = "monthly" THEN price
                    WHEN LOWER(billing_cycle) = "quarterly" THEN price / 3
                    WHEN LOWER(billing_cycle) = "yearly" THEN price / 12
                    ELSE price
                END <= ?
            ', [$normalizedMaxPrice]);
        }
        
        // Filter by billing cycle (only if no price filtering is happening)
        // When price filtering is active, we want to see all billing cycles for comparison
        if ($request->has('billing_cycle') && !$request->has('min_price') && !$request->has('max_price')) {
            $query->where('billing_cycle', $request->billing_cycle);
        }

        // Filter by bedrooms
        if ($request->has('bedrooms')) {
            $query->where('bedrooms', $request->bedrooms);
        }

        // Filter by amenities
        if ($request->has('amenities')) {
            $amenities = explode(',', $request->amenities);
            foreach ($amenities as $amenity) {
                $query->whereJsonContains('amenities', $amenity);
            }
        }

        // Sort by
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        $properties = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'properties' => $properties->items(),
            'pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ]
        ]);
    }

    // Get all properties with filtering
    public function indexAI($params)
    {
        Log::info('indexAI params: ' . json_encode($params));
        try {
            $query = Property::with('owner')->where('is_available', true);
            
            // Filter by location
            if (isset($params['location'])) {
                $locations = is_array($params['location']) ? $params['location'] : explode(',', $params['location']);
                
                if(count($locations) > 0) $query->whereIn('location', $locations);
            }
    
    
            // if ($request->has('with_preferences') && $request->with_preferences === 'true') {
            //     $user = Auth::user();
            //     $culturalPreferences = $user->cultural_preferences;
            //     $query->whereJsonContains('cultural_preferences', $culturalPreferences);
            // }
    
            if (isset($params['address']) && !empty($params['address'])) {
                $address = $params['address'];
                $query->where('address', 'like', '%' . $address . '%');
            }
    
            // Check if a string is contained in the description
            if (isset($params['description']) && !empty($params['description'])) {
                $desc = $params['description'];
                $query->where('description', 'like', '%' . $desc . '%');
            }
    
            // Filter by property type
            if (isset($params['property_type']) && !empty($params['property_type'])) {
                $query->where('property_type', $params['property_type']);
            }
    
            // Filter by room type
            if (isset($params['room_type']) && !empty($params['room_type'])) {
                $query->where('room_type', $params['room_type']);
            }
    
            // Filter by price range with billing cycle normalization
            if (isset($params['min_price']) && !empty($params['min_price'])) {
                $searchBillingCycle = $params['billing_cycle'] ?? 'monthly';
                $normalizedMinPrice = $this->normalizeSearchPrice($params['min_price'], $searchBillingCycle);
                
                // Convert property prices to monthly equivalent for comparison
                $query->whereRaw('
                    CASE 
                        WHEN LOWER(billing_cycle) = "monthly" THEN price
                        WHEN LOWER(billing_cycle) = "quarterly" THEN price / 3
                        WHEN LOWER(billing_cycle) = "yearly" THEN price / 12
                        ELSE price
                    END >= ?
                ', [$normalizedMinPrice]);
            }
            
            if (isset($params['max_price']) && !empty($params['max_price'])) {
                $searchBillingCycle = $params['billing_cycle'] ?? 'monthly';
                $normalizedMaxPrice = $this->normalizeSearchPrice($params['max_price'], $searchBillingCycle);
                
                // Convert property prices to monthly equivalent for comparison
                $query->whereRaw('
                    CASE 
                        WHEN LOWER(billing_cycle) = "monthly" THEN price
                        WHEN LOWER(billing_cycle) = "quarterly" THEN price / 3
                        WHEN LOWER(billing_cycle) = "yearly" THEN price / 12
                        ELSE price
                    END <= ?
                ', [$normalizedMaxPrice]);
            }
            
            // Filter by billing cycle (only if no price filtering is happening)
            // When price filtering is active, we want to see all billing cycles for comparison
            if (isset($params['billing_cycle']) && !empty($params['billing_cycle']) && 
                !isset($params['min_price']) && !isset($params['max_price'])) {
                $query->where('billing_cycle', $params['billing_cycle']);
            }
    
            // Filter by bedrooms
            if (isset($params['bedrooms']) && !empty($params['bedrooms'])) {
                $query->where('bedrooms', $params['bedrooms']);
            }
    
            // Filter by amenities
            if (isset($params['amenities'])) {
                $amenities = is_array($params['amenities']) ? $params['amenities'] : explode(',', $params['amenities']);
                if(count($amenities) > 0) {
                    foreach ($amenities as $amenity) {
                        $query->whereJsonContains('amenities', $amenity);
                    }
                }
            }
    
            // Sort by
            $sortBy = isset($params['sort_by']) ? $params['sort_by'] : 'created_at';
            $sortOrder = isset($params['sort_order']) ? $params['sort_order'] : 'desc';
            $query->orderBy($sortBy, $sortOrder);
    
            $properties = $query->limit(4)->get();
    
            return $properties;
        } catch (\Throwable $th) {
            Log::error('indexAI error: ' . $th->getMessage());
            return [];
        }
    }

    // Get single property
    public function show($slug)
    {
        $property = Property::with('owner')->where('slug', $slug)->where('is_available', true)->first();

        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }
        
        Log::info('property: ' . json_encode($property));

        return response()->json(['property' => $property->toPublicArray()]);
    }

    // Create new property
    public function store(Request $request)
    {   
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'location' => 'required|string',
            'address' => 'required|string',
            'coordinates' => 'nullable|string',
            'property_type' => 'required|string',
            'room_type' => 'required|string',
            'size' => 'required|integer',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'currency' => 'string|in:AED,USD,EUR',
            'billing_cycle' => 'required|string',
            'utilities_included' => 'nullable|in:true,false,1,0',
            'utilities_cost' => 'numeric|min:0',
            'amenities' => 'nullable|string',
            'available_from' => 'required|date',
            'minimum_stay' => 'integer|min:1',
            'maximum_stay' => 'integer|min:1',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max per image
            'roommate_preferences' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('properties', $filename, 'public');
                $imageUrls[] = asset('storage/' . $path);
            }
        }

        // Process JSON strings back to arrays
        $data = $request->all();
        
        // Handle address field
        if (isset($data['address']) && is_string($data['address'])) {
            $data['address'] = json_decode($data['address'], true);
        }
        
        // Handle coordinates field
        if (isset($data['coordinates']) && is_string($data['coordinates'])) {
            $data['coordinates'] = json_decode($data['coordinates'], true);
        }
        
        // Handle amenities field
        if (isset($data['amenities']) && is_string($data['amenities'])) {
            $data['amenities'] = json_decode($data['amenities'], true);
        }
        
        // Handle roommate_preferences field
        if (isset($data['roommate_preferences']) && is_string($data['roommate_preferences'])) {
            $data['roommate_preferences'] = json_decode($data['roommate_preferences'], true);
        }

        $property = Property::create(array_merge($data, [
            'slug' => Property::createUniqueSlug($request->title),
            'owner_id' => $request->user()->id,
            'currency' => $request->currency ?? 'AED',
            'utilities_included' => filter_var($request->utilities_included, FILTER_VALIDATE_BOOLEAN),
            'utilities_cost' => $request->utilities_cost ?? 0,
            'minimum_stay' => $request->minimum_stay ?? 1,
            'maximum_stay' => $request->maximum_stay ?? 12,
            'is_available' => false,
            'status' => 'Active',
            'images' => $imageUrls,
        ]));

        return response()->json([
            'message' => 'Property created successfully',
            'property' => $property->toPublicArray(),
        ], 201);
    }

    // Update property
    public function update(Request $request, $slug)
    {
        $property = Property::where('slug', $slug)
                           ->where('owner_id', $request->user()->id)
                           ->first();

        if (!$property) {
            return response()->json(['error' => 'Property not found or access denied'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:100',
            'description' => 'string|max:1000',
            'location' => 'string',
            'address' => 'string',
            'coordinates' => 'nullable|string',
            'property_type' => 'string',
            'room_type' => 'string',
            'size' => 'integer',
            'bedrooms' => 'integer|min:0',
            'bathrooms' => 'integer|min:0',
            'price' => 'numeric|min:0',
            'currency' => 'string|in:AED,USD,EUR',
            'billing_cycle' => 'string',
            'utilities_included' => 'nullable|in:true,false,1,0',
            'utilities_cost' => 'numeric|min:0',
            'amenities' => 'nullable|string',
            'available_from' => 'date',
            'minimum_stay' => 'integer|min:1',
            'maximum_stay' => 'integer|min:1',
            'is_available' => 'nullable|in:true,false,1,0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max per image
            'roommate_preferences' => 'nullable|string',
            'status' => 'string|in:Active,Pending,Rented,Inactive',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $updateData = $request->all();
        
        // Process JSON strings back to arrays
        if (isset($updateData['address']) && is_string($updateData['address'])) {
            $updateData['address'] = json_decode($updateData['address'], true);
        }
        
        if (isset($updateData['coordinates']) && is_string($updateData['coordinates'])) {
            $updateData['coordinates'] = json_decode($updateData['coordinates'], true);
        }
        
        if (isset($updateData['amenities']) && is_string($updateData['amenities'])) {
            $updateData['amenities'] = json_decode($updateData['amenities'], true);
        }
        
        if (isset($updateData['roommate_preferences']) && is_string($updateData['roommate_preferences'])) {
            $updateData['roommate_preferences'] = json_decode($updateData['roommate_preferences'], true);
        }
        
        // Convert string boolean values to actual booleans
        if (isset($updateData['utilities_included'])) {
            $updateData['utilities_included'] = filter_var($updateData['utilities_included'], FILTER_VALIDATE_BOOLEAN);
        }
        if (isset($updateData['is_available'])) {
            $updateData['is_available'] = filter_var($updateData['is_available'], FILTER_VALIDATE_BOOLEAN);
        }

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imageUrls = $property->images ?? []; // Keep existing images
            
            foreach ($request->file('images') as $image) {
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('properties', $filename, 'public');
                $imageUrls[] = asset('storage/' . $path);
            }
            
            $updateData['images'] = $imageUrls;
        }

        $property->update($updateData);

        return response()->json([
            'message' => 'Property updated successfully',
            'property' => $property->toPublicArray(),
        ]);
    }

    // Delete property
    public function destroy(Request $request, $slug)
    {
        $property = Property::where('slug', $slug)
                           ->where('owner_id', $request->user()->id)
                           ->first();

        if (!$property) {
            return response()->json(['error' => 'Property not found or access denied'], 404);
        }

        // Delete associated images from storage
        if ($property->images) {
            foreach ($property->images as $imageUrl) {
                $this->deleteImageFromStorage($imageUrl);
            }
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }

    // Helper method to delete image from storage
    private function deleteImageFromStorage($imageUrl)
    {
        try {
            // Extract path from URL
            $path = str_replace(asset('storage/'), '', $imageUrl);
            $fullPath = storage_path('app/public/' . $path);
            
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        } catch (\Exception $e) {
            Log::error('Failed to delete image: ' . $e->getMessage());
        }
    }

    // Get user's properties
    public function myProperties(Request $request)
    {
        $query = Property::where('owner_id', $request->user()->id);

        // Search by title
        if ($request->has('title')) {
            $titleTerm = $request->title;
            $query->where('title', 'like', "%{$titleTerm}%");
        }

        // Filter by status
        if ($request->has('is_available')) {
            if ($request->is_available === 'both') {
                // Do nothing
            } else {
                $query->where('is_available', $request->is_available);
            }
        }

        $properties = $query->orderBy('created_at', 'desc')
                           ->paginate($request->get('per_page', 10));

        return response()->json([
            'properties' => $properties->items(),
            'pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ]
        ]);
    }

    // Search properties
    public function search(Request $request)
    {
        $query = Property::with('owner')->where('is_available', true);

        // Text search
        if ($request->has('q')) {
            $searchTerm = $request->q;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('location', 'like', "%{$searchTerm}%");
            });
        }

        // Apply other filters
        if ($request->has('location')) {
            $locations = is_array($request->location) ? $request->location : explode(',', $request->location);
            $query->whereIn('location', $locations);
        }
        if ($request->has('property_type')) {
            $query->where('property_type', $request->property_type);
        }
        if ($request->has('min_price')) {
            $searchBillingCycle = $request->get('billing_cycle', 'monthly');
            $normalizedMinPrice = $this->normalizeSearchPrice($request->min_price, $searchBillingCycle);
            
            // Convert property prices to monthly equivalent for comparison
            $query->whereRaw('
                CASE 
                    WHEN LOWER(billing_cycle) = "monthly" THEN price
                    WHEN LOWER(billing_cycle) = "quarterly" THEN price / 3
                    WHEN LOWER(billing_cycle) = "yearly" THEN price / 12
                    ELSE price
                END >= ?
            ', [$normalizedMinPrice]);
        }
        
        if ($request->has('max_price')) {
            $searchBillingCycle = $request->get('billing_cycle', 'monthly');
            $normalizedMaxPrice = $this->normalizeSearchPrice($request->max_price, $searchBillingCycle);
            
            // Convert property prices to monthly equivalent for comparison
            $query->whereRaw('
                CASE 
                    WHEN LOWER(billing_cycle) = "monthly" THEN price
                    WHEN LOWER(billing_cycle) = "quarterly" THEN price / 3
                    WHEN LOWER(billing_cycle) = "yearly" THEN price / 12
                    ELSE price
                END <= ?
            ', [$normalizedMaxPrice]);
        }

        $properties = $query->orderBy('created_at', 'desc')
                           ->paginate($request->get('per_page', 10));

        return response()->json([
            'properties' => $properties->items(),
            'pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ]
        ]);
    }

    public function chatAI(Request $request) {
        $openAIService = new OpenAIService();
        try {
            $response = $openAIService->sendMessage($request->message, $request->thread_id ?? null);
            
            
            $search_params = [];
            // Check if assistant_reply contains JSON
            if (isset($response['assistant_reply'])) {
                $assistantReply = $response['assistant_reply'];
                
                // First, try to decode the entire string as JSON
                $decodedJson = json_decode($assistantReply, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    // If it's valid JSON, merge it with the response
                    $search_params = $decodedJson;
                } else {
                    // Try to extract JSON from within the text (look for JSON blocks)
                    $jsonMatches = [];
                    
                    // Pattern to match JSON objects or arrays within text
                    $patterns = [
                        '/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/', // JSON objects
                        '/\[[^\[\]]*(?:\{[^{}]*\}[^\[\]]*)*\]/' // JSON arrays
                    ];
                    
                    foreach ($patterns as $pattern) {
                        if (preg_match_all($pattern, $assistantReply, $matches)) {
                            foreach ($matches[0] as $match) {
                                $decoded = json_decode($match, true);
                                if (json_last_error() === JSON_ERROR_NONE) {
                                    $jsonMatches[] = [
                                        'json' => $decoded,
                                        'raw' => $match
                                    ];
                                }
                            }
                        }
                    }

                    
                    if (!empty($jsonMatches)) {
                        $search_params = $jsonMatches[0]['json'];
                    }
                }
            }

            if (count($search_params) > 0) {
                $properties = $this->indexAI($search_params);
                $response['properties'] = $properties;
                $response['assistant_reply'] = '';
            }
            
            return response()->json($response);
        } catch (\Throwable $th) {
            Log::error('chatAI error: ' . $th->getMessage());
            return response()->json(['message' => 'Whoops, that didn\'t come out right — please try again!'], 500);
        }
    }
}
