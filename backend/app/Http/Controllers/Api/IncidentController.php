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
        //
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
