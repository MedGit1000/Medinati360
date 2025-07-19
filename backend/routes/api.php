<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\IncidentController;

// Test route
Route::get('/test', function () {
    return response()->json(['status' => 'API working', 'time' => now()]);
});

// Debug auth route
Route::get('/debug-auth', function (Request $request) {
    $user = null;
    $sanctumUser = null;

    try {
        $user = $request->user();
        $sanctumUser = auth('sanctum')->user();
    } catch (\Exception $e) {
        // Ignore
    }

    return response()->json([
        'has_bearer_token' => !!$request->bearerToken(),
        'bearer_token_preview' => $request->bearerToken() ? substr($request->bearerToken(), 0, 20) . '...' : null,
        'request_user' => $user ? [
            'id' => $user->id,
            'email' => $user->email,
            'is_admin' => $user->is_admin
        ] : null,
        'sanctum_user' => $sanctumUser ? [
            'id' => $sanctumUser->id,
            'email' => $sanctumUser->email,
            'is_admin' => $sanctumUser->is_admin
        ] : null,
        'guards' => [
            'web' => auth('web')->check(),
            'sanctum' => auth('sanctum')->check(),
        ],
        'session_exists' => session()->getId() !== null,
        'csrf_token' => csrf_token(),
    ]);
});

// Test approve route
Route::post('/test-approve/{id}', function ($id) {
    return response()->json([
        'message' => 'Test approve route works',
        'id' => $id,
        'method' => request()->method()
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']);

// Incidents route (accessible to all)
Route::get('/incidents', [IncidentController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/incidents', [IncidentController::class, 'store']);

    // Admin routes
    Route::post('/incidents/{id}/approve', [IncidentController::class, 'approve']);
    Route::post('/incidents/{id}/reject', [IncidentController::class, 'reject']);
    Route::put('/incidents/{id}/status', [IncidentController::class, 'updateStatus']);
});
