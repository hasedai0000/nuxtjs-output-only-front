<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->todos()->orderBy('id');

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

        $todo = $request->user()->todos()->create($validated);

        return response()->json($todo, Response::HTTP_CREATED);
    }

    public function show(Request $request, Todo $todo): JsonResponse
    {
        $this->authorizeOwnership($request, $todo);

        return response()->json($todo);
    }

    public function update(Request $request, Todo $todo): JsonResponse
    {
        $this->authorizeOwnership($request, $todo);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    public function destroy(Request $request, Todo $todo): Response
    {
        $this->authorizeOwnership($request, $todo);

        $todo->delete();

        return response()->noContent();
    }

    private function authorizeOwnership(Request $request, Todo $todo): void
    {
        if ($todo->user_id !== $request->user()->id) {
            throw (new ModelNotFoundException)->setModel(Todo::class, [$todo->id]);
        }
    }
}
