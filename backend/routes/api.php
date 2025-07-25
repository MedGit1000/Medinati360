<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\IncidentController;

/*
|--------------------------------------------------------------------------
| Unauthenticated / diagnostic routes
|--------------------------------------------------------------------------
*/

Route::get('/test', fn() => response()->json([
    'status' => 'API working',
    'time'   => now(),
]));

Route::get('/debug-auth', function (Request $request) {
    return response()->json([
        'bearer_token_preview' => $request->bearerToken()
            ? substr($request->bearerToken(), 0, 20) . '…'
            : null,
        'request_user'  => $request->user(),
        'sanctum_user'  => auth('sanctum')->user(),
        'guards'        => [
            'web'     => auth('web')->check(),
            'sanctum' => auth('sanctum')->check(),
        ],
    ]);
});

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login'])->name('login');
Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

/*
|--------------------------------------------------------------------------
| Protected routes (require Sanctum token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /* --- Incidents --- */
    Route::get('/incidents',              [IncidentController::class, 'index']);
    Route::post('/incidents',              [IncidentController::class, 'store']);
    Route::post('/incidents/{id}/approve', [IncidentController::class, 'approve']);
    Route::post('/incidents/{id}/reject',  [IncidentController::class, 'reject']);
    Route::put('/incidents/{id}/status',  [IncidentController::class, 'updateStatus']);
    Route::get('/my-incidents',           [IncidentController::class, 'myIncidents']);
    Route::post('/incidents/{incident}',  [IncidentController::class, 'update']);
    Route::delete('/incidents/{incident}', [IncidentController::class, 'destroy']);

    /* --- User information --- */
    Route::get('/user', fn(Request $request) => response()->json($request->user()));

    /* --- User-management (super-admin only) --- */
    Route::middleware('superadmin')->group(function () {
        Route::get('/users',               [UserController::class, 'index']);
        Route::post('/users/{user}/promote', [UserController::class, 'promote']);
    });

    Route::get('/notifications', function (Request $request) {
        return $request->user()
            ->notifications()
            ->latest()
            ->take(20)
            ->get();
    });

    Route::post('/notifications/{id}/read', function (Request $request, $id) {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return response()->noContent();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});
