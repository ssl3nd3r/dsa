<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\PropertyInterest;

class PropertyInterestController extends Controller
{
    /**
     * Express interest in a property
     */
    public function expressInterest(Request $request, $propertySlug)
    {
        $property = Property::where('slug', $propertySlug)->first();
        
        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }

        if ($property->owner_id === $request->user()->id) {
            return response()->json(['error' => 'You cannot express interest in your own property'], 400);
        }

        if (!$property->is_available) {
            return response()->json(['error' => 'This property is not available'], 400);
        }

        // Check if user already expressed interest
        $existingInterest = PropertyInterest::where('user_id', $request->user()->id)
                                           ->where('property_id', $property->id)
                                           ->first();

        if ($existingInterest) {
            return response()->json(['error' => 'You have already expressed interest in this property'], 400);
        }

        $interest = PropertyInterest::create([
            'user_id' => $request->user()->id,
            'property_id' => $property->id,
        ]);

        return response()->json([
            'message' => 'Interest expressed successfully',
            'interest' => $interest->load('user', 'property'),
        ], 201);
    }

    /**
     * Check if user has expressed interest in a property
     */
    public function checkInterest(Request $request, $propertySlug)
    {
        $property = Property::where('slug', $propertySlug)->first();
        
        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }

        $interest = PropertyInterest::where('user_id', $request->user()->id)
                                  ->where('property_id', $property->id)
                                  ->first();

        return response()->json([
            'has_interest' => $interest ? true : false,
            'interest' => $interest,
        ]);
    }

    /**
     * Withdraw interest
     */
    public function withdrawInterest(Request $request, $propertySlug)
    {
        $property = Property::where('slug', $propertySlug)->first();

        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }

        $interest = PropertyInterest::where('user_id', $request->user()->id)
                                  ->where('property_id', $property->id)
                                  ->first();

        if (!$interest) {
            return response()->json(['error' => 'Interest not found or access denied'], 404);
        }

        $interest->delete();

        return response()->json([
            'message' => 'Interest withdrawn successfully',
        ]);
    }

    /**
     * Get all properties the user has expressed interest in
     */
    public function getUserInterestedProperties(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $perPage = min(max($perPage, 1), 50); // Limit between 1 and 50s
        $titleQuery = $request->get('title');

        $query = PropertyInterest::where('user_id', $request->user()->id)
                                ->with(['property']);

        // Filter by title if provided
        if ($titleQuery) {
            $query->whereHas('property', function ($propertyQuery) use ($titleQuery) {
                $propertyQuery->where('title', 'like', '%' . $titleQuery . '%');
            });
        }

        $interestedProperties = $query->orderBy('created_at', 'desc')
                                     ->paginate($perPage);

        // Extract only the properties from the PropertyInterest models
        $properties = $interestedProperties->getCollection()->pluck('property');

        return response()->json([
            'properties' => $properties,
            'pagination' => [
                'current_page' => $interestedProperties->currentPage(),
                'last_page' => $interestedProperties->lastPage(),
                'per_page' => $interestedProperties->perPage(),
                'total' => $interestedProperties->total(),
            ],
        ]);
    }
} 