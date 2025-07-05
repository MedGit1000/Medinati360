<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IncidentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/incidents', [IncidentController::class, 'index']);


// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/incidents', [IncidentController::class, 'index']);

// Routes Protégées (nécessitent un token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/incidents', [IncidentController::class, 'store']);
    // On ajoutera la route de déconnexion ici plus tard
    // Route::post('/logout', [AuthController::class, 'logout']);
});
