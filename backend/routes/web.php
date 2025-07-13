<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/api/health');
});

Route::get('/test', function () {

    if (env('APP_ENV','production') == 'production') {
        abort(404);
    }

    
    $propertiesController = new \App\Http\Controllers\Api\PropertyController();
    $request = [
        'max_price' => 3000,
        'location' => ['JBR (Jumeirah Beach Residence)'],
        'room_type' => 'Private Room',
        'amenities' => [],
        'billing_cycle' => 'Monthly'
    ];
    $response = $propertiesController->indexAI($request);
    return response()->json($response);
});
