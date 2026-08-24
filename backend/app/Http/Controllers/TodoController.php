<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Todo::query()->orderBy('id');

        if ($keyword = $request->query('keyword')) {
            $query->where('title', 'like', $keyword.'%');
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $todo = Todo::create($validated);

        return response()->json($todo, Response::HTTP_CREATED);
    }

    public function show(Todo $todo): JsonResponse
    {
        return response()->json($todo);
    }

    public function update(Request $request, Todo $todo): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    public function destroy(Todo $todo): Response
    {
        $todo->delete();

        return response()->noContent();
    }
}
