<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Property;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    // Get all properties with filtering
    public function index(Request $request)
    {
        $query = Property::with('owner')->where('is_available', true);

        // Filter by location
        if ($request->has('location')) {
            $locations = is_array($request->location) ? $request->location : explode(',', $request->location);
            $query->whereIn('location', $locations);
        }

        // Filter by property type
        if ($request->has('property_type')) {
            $query->where('property_type', $request->property_type);
        }

        // Filter by room type
        if ($request->has('room_type')) {
            $query->where('room_type', $request->room_type);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
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

    // Get single property
    public function show($slug)
    {
        $property = Property::with('owner')->where('slug', $slug)->where('is_available', true)->first();

        Log::info('Property:', Property::where('slug', $slug)->get()->toArray());
        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }

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
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
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
}
