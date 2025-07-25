<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Hash;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'profile_image',
        'lifestyle',
        'personality_traits',
        'work_schedule',
        'cultural_preferences',
        'budget',
        'preferred_areas',
        'move_in_date',
        'lease_duration',
        'is_verified',
        'is_active',
        'unread_count',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'personality_traits' => 'array',
        'cultural_preferences' => 'array',
        'budget' => 'array',
        'preferred_areas' => 'array',
        'move_in_date' => 'date',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'lifestyle' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        // 'interested_properties',
        'interested_property_ids',
    ];

    // /**
    //  * Get interested properties attribute
    //  */
    // public function getInterestedPropertiesAttribute()
    // {
    //     return $this->interestedProperties()->with('owner')->get();
    // }

    /**
     * Get interested properties IDs attribute
     */
    public function getInterestedPropertyIdsAttribute()
    {
        return $this->interestedProperties()->pluck('properties.id')->toArray();
    }

    /**
     * Get public profile data (without password)
     */
    public function toPublicArray()
    {
        $userArray = $this->toArray();
        unset($userArray['password']);
        return $userArray;
    }

    /**
     * Compare password
     */
    public function comparePassword($candidatePassword)
    {
        return Hash::check($candidatePassword, $this->password);
    }

    /**
     * Relationships
     */
    public function properties()
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function reviewsWritten()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Get all properties the user has expressed interest in
     */
    public function propertyInterests()
    {
        return $this->hasMany(PropertyInterest::class);
    }

    /**
     * Get properties the user is interested in
     */
    public function interestedProperties()
    {
        return $this->belongsToMany(Property::class, 'property_interests')
                    ->withTimestamps();
    }

    public function canAccessPanel(Panel $panel): bool
    {
        $allowedEmails = [
            'jimmy@dsa.ae',
            'mayad@dsa.ae',
        ];

        return in_array($this->email, $allowedEmails);
    }
}
