<?php

namespace App\Http\Controllers\Api;

use App\Models\Incident;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incidents = Incident::with(['user:id,name', 'category:id,name'])
            ->latest()
            ->get();

        return response()->json($incidents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category_id' => 'required|exists:categories,id', // Doit exister dans la table categories
        ]);

        // Crée l'incident en l'associant directement à l'utilisateur authentifié
        $incident = $request->user()->incidents()->create($validatedData);

        return response()->json($incident, 201); // 201 = Created
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
