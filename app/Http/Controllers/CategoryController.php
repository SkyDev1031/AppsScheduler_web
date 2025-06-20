<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    private function ensureDefaultCategories($researcherId)
    {
        $defaults = [
            ['title' => 'Social & Communication', 'role' => 0],
            ['title' => 'Music & Audio', 'role' => 0],
            ['title' => 'Games', 'role' => 0],
            ['title' => 'Productivity', 'role' => 0],
            ['title' => 'Tools', 'role' => 0],
            ['title' => 'Entertainment', 'role' => 0],
            ['title' => 'Education', 'role' => 0],
            ['title' => 'Health/Fitness', 'role' => 0],
            ['title' => 'Photography', 'role' => 0],
            ['title' => 'News', 'role' => 0],
            ['title' => 'Navigation', 'role' => 0],
            ['title' => 'Accessibility', 'role' => 0],
            ['title' => 'Communication', 'role' => 0],
            ['title' => 'System apps', 'role' => 1],
            ['title' => 'Ignored apps', 'role' => 1],
            ['title' => 'Not Specified', 'role' => 1],
        ];

        foreach ($defaults as $category) {
            Category::firstOrCreate([
                'researcher_id' => $researcherId,
                'title' => $category['title'],
            ], [
                'role' => $category['role'],
            ]);
        }
    }

    public function index()
    {
        $researcherId = Auth::user()->id;
    
        if (Category::where('researcher_id', $researcherId)->count() === 0) {
            $this->ensureDefaultCategories($researcherId);
        }

        $categories = Category::where('researcher_id', $researcherId)
                                ->orderBy('role')
                                ->orderBy('title')
                                ->get();
    
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'researcher_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'role' => 'required|integer|in:0,1,2',
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
