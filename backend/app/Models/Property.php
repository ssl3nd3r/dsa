<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'location',
        'address',
        'coordinates',
        'property_type',
        'room_type',
        'size',
        'bedrooms',
        'bathrooms',
        'price',
        'currency',
        'billing_cycle',
        'utilities_included',
        'utilities_cost',
        'amenities',
        'available_from',
        'minimum_stay',
        'maximum_stay',
        'is_available',
        'images',
        'owner_id',
        'roommate_preferences',
        'matching_score',
        'status',
    ];

    protected $casts = [
        'location' => 'string',
        'address' => 'array',
        'coordinates' => 'array',
        'amenities' => 'array',
        'images' => 'array',
        'roommate_preferences' => 'array',
        'utilities_included' => 'boolean',
        'is_available' => 'boolean',
        'available_from' => 'date',
        'matching_score' => 'integer',
    ];

    /**
     * Get public data (without sensitive info)
     */
    public function toPublicArray()
    {
        $propertyArray = $this->toArray();
        if (Auth::check()) {
            $propertyArray['is_interested'] = $this->hasUserInterest(Auth::user()->id);
        }
        unset($propertyArray['owner_id']);
        return $propertyArray;
    }

    public static function createUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $count = self::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . $count;
        }
        return $slug;
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute()
    {
        return "{$this->price} {$this->currency}";
    }

    /**
     * Relationships
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get all interests for this property
     */
    public function interests()
    {
        return $this->hasMany(PropertyInterest::class);
    }



    /**
     * Check if a user has expressed interest in this property
     */
    public function hasUserInterest($userId)
    {
        return $this->interests()->where('user_id', $userId)->exists();
    }

    /**
     * Get user's interest in this property
     */
    public function getUserInterest($userId)
    {
        return $this->interests()->where('user_id', $userId)->first();
    }
}
