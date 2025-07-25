<?php

namespace App\Http\Controllers\Api;

use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Notifications\IncidentStatusChanged;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Incident::with(['user:id,name', 'category:id,name', 'approvedBy:id,name']);
            $user = Auth::user();

            // Admin & Superadmin: Can see all incidents and filter by approval status.
            if ($user && in_array($user->role, ['admin', 'superadmin'])) {
                if ($request->has('approval_status') && $request->approval_status !== 'all') {
                    switch ($request->approval_status) {
                        case 'pending':
                            $query->where('is_approved', false)->whereNull('rejection_reason');
                            break;
                        case 'approved':
                            $query->where('is_approved', true);
                            break;
                        case 'rejected':
                            $query->where('is_approved', false)->whereNotNull('rejection_reason');
                            break;
                    }
                }
                // Regular Authenticated User: Sees all approved incidents AND their own incidents.
            } else if ($user) {
                $query->where(function ($q) use ($user) {
                    $q->where('is_approved', true) // Approved by admin
                        ->orWhere('user_id', $user->id); // Or is their own
                });
                // Guest (Not Authenticated): Sees only approved incidents.
            } else {
                $query->where('is_approved', true);
            }

            $incidents = $query->latest()->get();
            return response()->json($incidents);
        } catch (\Exception $e) {
            Log::error('Error in incidents index: ' . $e->getMessage());
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // We wrap everything in a try-catch block to handle any potential error.
        try {
            // 1. Validate the incoming data from the form.
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'category_id' => 'required|exists:categories,id',
                'photo' => 'nullable|image|max:5120', // 5MB max
            ]);
            $dataToSave['status']      = Incident::STATUS_PENDING;   // instead of 'Reçu'
            $dataToSave['is_approved'] = false;

            // 2. Prepare the data for the database.
            $dataToSave            = $validatedData;
            $dataToSave['user_id'] = Auth::id();
            $dataToSave['status']  = Incident::STATUS_PENDING;   // 👈 final value
            $dataToSave['is_approved'] = false;


            // 3. If a photo was uploaded, save it and get its path.
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('incidents', 'public');
                $dataToSave['photo_path'] = $path;
            }

            // We don't need the temporary 'photo' data anymore.
            unset($dataToSave['photo']);

            // 4. Create the record in the database.
            $incident = Incident::create($dataToSave);

            // 5. Return a successful response with the created incident.
            return response()->json($incident, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // If validation fails, return a 422 error with the specific problems.
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // For any other unexpected errors, log them and return a 500 error.
            Log::error('INCIDENT CREATION FAILED: ' . $e->getMessage());
            return response()->json(['message' => 'An internal server error occurred.'], 500);
        }
    }
    /**
     * Approve an incident (Admin or Superadmin only)
     */
    public function approve($id)
    {
        $user = Auth::user();
        // Check if user is admin OR superadmin
        if (!$user || !in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Non autorisé - Admin requis'], 403);
        }

        $incident = Incident::findOrFail($id);

        $incident->update([
            'is_approved' => true,
            'status'           => Incident::STATUS_APPROVED,
            'approved_by' => $user->id,
            'approved_at' => now(),
            'rejection_reason' => null,

        ]);

        $incident->user->notify(
            new IncidentStatusChanged($incident, Incident::STATUS_APPROVED)
        );

        $incident->load(['user:id,name', 'category:id,name', 'approvedBy:id,name']);

        return response()->json([
            'message' => 'Incident approuvé avec succès',
            'incident' => $incident
        ]);
    }

    /**
     * Reject an incident (Admin or Superadmin only)
     */
    public function reject(Request $request, $id)
    {
        $user = Auth::user();

        // Check if user is admin OR superadmin
        if (!$user || !in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Non autorisé - Admin requis'], 403);
        }

        $request->validate(['reason' => 'required|string|max:500']);
        $incident = Incident::findOrFail($id);

        $incident->update([
            'is_approved' => false,
            'status'           => Incident::STATUS_REJECTED,
            'rejection_reason' => $request->reason,
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        $incident->user->notify(
            new IncidentStatusChanged($incident, Incident::STATUS_REJECTED)
        );

        $incident->load(['user:id,name', 'category:id,name', 'approvedBy:id,name']);

        return response()->json([
            'message' => 'Incident rejeté',
            'incident' => $incident
        ]);
    }

    /**
     * Update the status of an incident (Admin or Superadmin only)
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();

        // Check if user is admin OR superadmin
        if (!$user || !in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Non autorisé - Admin requis'], 403);
        }

        $request->validate(['status' => 'required|in:Reçu,En cours,Résolu']);
        $incident = Incident::findOrFail($id);
        $incident->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut mis à jour',
            'incident' => $incident
        ]);
    }


    /**
     * Display a listing of the authenticated user's incidents.
     */
    public function myIncidents(Request $request)
    {
        try {
            $incidents = $request->user()->incidents()
                ->with(['category:id,name', 'approvedBy:id,name']) // Eager load relationships
                ->latest() // Order by most recent
                ->get();

            return response()->json($incidents);
        } catch (\Exception $e) {
            Log::error('Error in myIncidents: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
    public function update(Request $request, Incident $incident)
    {
        $user = $request->user();

        // 1. Authorization Check: Allow if user is owner OR an admin/superadmin
        $isOwner = $user->id === $incident->user_id;
        $isAdmin = in_array($user->role, ['admin', 'superadmin']);

        if (!$isOwner && !$isAdmin) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        // 2. Status Check: Regular users can only edit if pending. Admins can edit anytime.
        if ($isOwner && !$isAdmin && ($incident->is_approved || $incident->rejection_reason)) {
            return response()->json(['message' => 'Impossible de modifier un incident qui a déjà été examiné.'], 403);
        }

        // 3. Validation
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'latitude' => 'sometimes|required|numeric',
            'longitude' => 'sometimes|required|numeric',
            'photo' => 'nullable|image|max:5120', // 5MB max
        ]);

        // 4. Handle Photo Update
        if ($request->hasFile('photo')) {
            // Delete the old photo if it exists
            if ($incident->photo_path) {
                Storage::disk('public')->delete($incident->photo_path);
            }
            // Store the new photo
            $validatedData['photo_path'] = $request->file('photo')->store('incidents', 'public');
        }

        // 5. Update Incident
        $incident->update($validatedData);

        return response()->json($incident);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Incident $incident)
    {
        $user = $request->user();

        // 1. Authorization Check: Allow if user is owner OR an admin/superadmin
        $isOwner = $user->id === $incident->user_id;
        $isAdmin = in_array($user->role, ['admin', 'superadmin']);

        if (!$isOwner && !$isAdmin) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        // 2. Status Check: Regular users can only delete if pending. Admins can delete anytime.
        if ($isOwner && !$isAdmin && ($incident->is_approved || $incident->rejection_reason)) {
            return response()->json(['message' => 'Impossible de supprimer un incident qui a déjà été examiné.'], 403);
        }

        // 3. Delete Photo from Storage
        if ($incident->photo_path) {
            Storage::disk('public')->delete($incident->photo_path);
        }

        // 4. Delete Incident
        $incident->delete();

        return response()->noContent(); // 204 No Content
    }
}
