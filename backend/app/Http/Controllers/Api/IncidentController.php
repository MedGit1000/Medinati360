<?php

namespace App\Http\Controllers\Api;

use App\Models\Incident;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Build base query with relationships
            $query = Incident::with(['user:id,name', 'category:id,name', 'approvedBy:id,name']);

            // Try multiple methods to get authenticated user
            $user = null;

            // Method 1: From request
            if ($request->user()) {
                $user = $request->user();
            }
            // Method 2: From auth guard
            elseif (Auth::guard('sanctum')->check()) {
                $user = Auth::guard('sanctum')->user();
            }
            // Method 3: From bearer token
            elseif ($request->bearerToken()) {
                $user = Auth::guard('sanctum')->user();
            }

            $isAdmin = $user && $user->is_admin;

            // Log for debugging
            Log::info('Incident index request', [
                'has_bearer_token' => !!$request->bearerToken(),
                'bearer_token' => substr($request->bearerToken() ?? '', 0, 10) . '...',
                'user_id' => $user ? $user->id : null,
                'user_email' => $user ? $user->email : 'guest',
                'is_admin' => $isAdmin,
                'approval_status' => $request->get('approval_status', 'none')
            ]);

            // Apply filters based on user type and request
            if ($isAdmin && $request->has('approval_status')) {
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
                    case 'all':
                        // No filter - admin sees all
                        break;
                }
            } elseif ($user) {
                // Authenticated users see all incidents (no filter)
                Log::info('Authenticated user - showing all incidents');
            } else {
                // Guests only see approved
                $query->where('is_approved', true);
                Log::info('Guest user - showing only approved incidents');
            }

            $incidents = $query->latest()->get();

            Log::info('Returning incidents', [
                'count' => $incidents->count(),
                'user_type' => $user ? ($isAdmin ? 'admin' : 'user') : 'guest'
            ]);

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
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'category_id' => 'required|exists:categories,id',
                'photo' => 'nullable|image|max:5120',
            ]);

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('incidents', 'public');
                $validatedData['photo_path'] = $path;
            }

            unset($validatedData['photo']);
            $validatedData['status'] = 'Reçu';
            $validatedData['is_approved'] = false;

            $incident = $request->user()->incidents()->create($validatedData);
            $incident->load(['user:id,name', 'category:id,name']);

            return response()->json([
                'message' => 'Incident créé avec succès. Il sera visible après approbation par un administrateur.',
                'incident' => $incident
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating incident: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la création'], 500);
        }
    }

    /**
     * Approve an incident (Admin only)
     */
    public function approve(Request $request, $id)
    {
        try {
            // Get authenticated user
            $user = $request->user() ?? Auth::guard('sanctum')->user();

            Log::info('Approve request', [
                'incident_id' => $id,
                'has_user' => !!$user,
                'user_id' => $user ? $user->id : null,
                'is_admin' => $user ? $user->is_admin : false,
                'bearer_token' => substr($request->bearerToken() ?? '', 0, 10) . '...'
            ]);

            // Check if user is admin
            if (!$user || !$user->is_admin) {
                return response()->json(['message' => 'Non autorisé - Admin requis'], 403);
            }

            $incident = Incident::findOrFail($id);

            $incident->update([
                'is_approved' => true,
                'approved_by' => $user->id,
                'approved_at' => now(),
                'rejection_reason' => null,
            ]);

            $incident->load(['user:id,name', 'category:id,name', 'approvedBy:id,name']);

            return response()->json([
                'message' => 'Incident approuvé avec succès',
                'incident' => $incident
            ]);
        } catch (\Exception $e) {
            Log::error('Error approving incident: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'approbation', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Reject an incident (Admin only)
     */
    public function reject(Request $request, $id)
    {
        try {
            // Get authenticated user
            $user = $request->user() ?? Auth::guard('sanctum')->user();

            Log::info('Reject request', [
                'incident_id' => $id,
                'has_user' => !!$user,
                'user_id' => $user ? $user->id : null,
                'is_admin' => $user ? $user->is_admin : false
            ]);

            // Check if user is admin
            if (!$user || !$user->is_admin) {
                return response()->json(['message' => 'Non autorisé - Admin requis'], 403);
            }

            $request->validate([
                'reason' => 'required|string|max:500'
            ]);

            $incident = Incident::findOrFail($id);

            $incident->update([
                'is_approved' => false,
                'rejection_reason' => $request->reason,
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);

            $incident->load(['user:id,name', 'category:id,name', 'approvedBy:id,name']);

            return response()->json([
                'message' => 'Incident rejeté',
                'incident' => $incident
            ]);
        } catch (\Exception $e) {
            Log::error('Error rejecting incident: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors du rejet', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the status of an incident
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:Reçu,En cours,Résolu'
            ]);

            $incident = Incident::findOrFail($id);

            $user = $request->user() ?? Auth::guard('sanctum')->user();
            if (!$user || !$user->is_admin) {
                return response()->json(['message' => 'Non autorisé - Admin requis'], 403);
            }

            $incident->update(['status' => $request->status]);

            return response()->json([
                'message' => 'Statut mis à jour',
                'incident' => $incident
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating status: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour'], 500);
        }
    }
}
