<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Profile Information
            $table->string('phone')->nullable();
            $table->string('profile_image')->nullable();
            
            // AI Matching Fields
            $table->json('lifestyle')->nullable();
            $table->json('personality_traits')->nullable();
            $table->string('work_schedule')->nullable();
            $table->json('cultural_preferences')->nullable();
            
            // Accommodation Preferences
            $table->json('budget')->nullable();
            $table->json('preferred_areas')->nullable();
            $table->date('move_in_date')->nullable();
            $table->enum('lease_duration', ['1-3 months', '3-6 months', '6-12 months', '1+ years'])->nullable();
            
            // Account Status
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
