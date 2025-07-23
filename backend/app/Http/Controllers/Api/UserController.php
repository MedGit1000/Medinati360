<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     * (Super Admin only)
     */
    public function index()
    {
        // Return all users except the superadmin itself
        $users = User::where('role', '!=', 'superadmin')->get();
        return response()->json($users);
    }

    /**
     * Promote a user to the 'admin' role.
     * (Super Admin only)
     */
    public function promote(Request $request, User $user)
    {
        // Prevent promoting a superadmin
        if ($user->role === 'superadmin') {
            return response()->json(['message' => 'Cannot change the role of a Super Admin.'], 400);
        }

        $user->role = 'admin';
        $user->save();

        return response()->json([
            'message' => 'User successfully promoted to Admin.',
            'user' => $user
        ]);
    }
}
