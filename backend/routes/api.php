<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\MessagingController;
use App\Http\Controllers\Api\ServiceProviderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\OtpController;
use App\Http\Controllers\Api\PropertyInterestController;

// Public routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/register/complete', [UserController::class, 'completeRegister']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/login/complete', [UserController::class, 'completeLogin']);
Route::get('/admin', fn () => redirect('/admin'));

// Register OTP routes
Route::post('/otp/register/resend', [OtpController::class, 'resendRegisterOtp']);

// Login OTP routes
Route::post('/otp/login/resend', [OtpController::class, 'resendLoginOtp']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'changePassword']);
    
    // Property routes
    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/search', [PropertyController::class, 'search']);
    Route::post('/properties/my', [PropertyController::class, 'myProperties']);
    Route::post('/properties/interested', [PropertyInterestController::class, 'getUserInterestedProperties']);
    Route::get('/properties/{slug}', [PropertyController::class, 'show']);
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{slug}', [PropertyController::class, 'update']);
    Route::delete('/properties/{slug}', [PropertyController::class, 'destroy']);
    Route::post('/properties/chat', [PropertyController::class, 'chatAI']);
    

    // Message routes
    Route::post('/messages', [MessagingController::class, 'store']);
    Route::get('/messages/conversations', [MessagingController::class, 'conversations']);
    Route::get('/messages/conversation/{conversationId}', [MessagingController::class, 'conversation']);
    Route::get('/messages/unread-count', [MessagingController::class, 'unreadCount']);
    Route::put('/messages/conversation/{conversationId}/read', [MessagingController::class, 'markAsRead']);
    Route::put('/messages/user/{userId}/read-all', [MessagingController::class, 'markAllAsRead']);
    Route::delete('/messages/{messageId}', [MessagingController::class, 'destroy']);
    Route::get('/messages/property/{propertyId}', [MessagingController::class, 'propertyMessages']);
    
    // Service Provider routes
    Route::get('/service-providers', [ServiceProviderController::class, 'index']);
    Route::get('/service-providers/search', [ServiceProviderController::class, 'search']);
    Route::get('/service-providers/types', [ServiceProviderController::class, 'serviceTypes']);
    Route::get('/service-providers/type/{serviceType}', [ServiceProviderController::class, 'byType']);
    Route::get('/service-providers/{id}', [ServiceProviderController::class, 'show']);
    Route::post('/service-providers', [ServiceProviderController::class, 'store']);
    Route::put('/service-providers/{id}', [ServiceProviderController::class, 'update']);
    Route::delete('/service-providers/{id}', [ServiceProviderController::class, 'destroy']);
    
    // Unified Review routes (for users, properties, and service providers)
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews/{type}/{id}', [ReviewController::class, 'index']); // users/1, properties/1, service-providers/1
    Route::get('/reviews/my', [ReviewController::class, 'myReviews']);
    Route::put('/reviews/{reviewId}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{reviewId}', [ReviewController::class, 'destroy']);
    Route::get('/reviews/{type}/{id}/statistics', [ReviewController::class, 'statistics']);
    Route::get('/reviews/type/{type}', [ReviewController::class, 'byType']); // users, properties, service-providers
    
    // Property Interest routes
    Route::post('/properties/{propertySlug}/interest', [PropertyInterestController::class, 'expressInterest']);
    Route::get('/properties/{propertySlug}/interest', [PropertyInterestController::class, 'checkInterest']);
    Route::delete('/properties/{propertySlug}/interest', [PropertyInterestController::class, 'withdrawInterest']);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()->toISOString(),
        'uptime' => time() - $_SERVER['REQUEST_TIME'] ?? time(),
    ]);
}); 