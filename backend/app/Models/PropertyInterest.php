<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyInterest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
    ];

    /**
     * Get the user who expressed interest
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the property of interest
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
} 