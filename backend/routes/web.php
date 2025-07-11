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
    $request = new \Illuminate\Http\Request([
        'max_price' => 80000,
        'min_price' => 1000,
        // 'location' => ['Palm Jumeirah'],
    ]);
    $response = $propertiesController->index($request);
    return response()->json($response);
});
