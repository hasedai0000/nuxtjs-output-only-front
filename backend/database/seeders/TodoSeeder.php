<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    public function run(): void
    {
        Todo::query()->delete();

        Todo::create([
            'title' => 'Todo1',
            'content' => 'Todo1の内容',
        ]);

        Todo::create([
            'title' => 'Todo2',
            'content' => 'Todo2の内容',
        ]);
    }
}
