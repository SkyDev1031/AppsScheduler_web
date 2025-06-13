<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'researcher_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.',
        ]);
    }
}
