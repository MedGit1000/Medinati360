<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index()
    {
        try {
            $categories = Category::select('id', 'name', 'icon')->get();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load categories'], 500);
        }
    }
}
