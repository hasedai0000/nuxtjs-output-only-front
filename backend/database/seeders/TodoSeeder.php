<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'demo@example.com')->firstOrFail();

        Todo::query()->where('user_id', $user->id)->delete();

        $samples = [
            ['title' => '牛乳を買う', 'content' => '低脂肪 1L'],
            ['title' => '請求書を送る', 'content' => '10月分の請求書を経理に送付'],
            ['title' => '歯医者の予約', 'content' => '来週の木曜午前中で予約する'],
            ['title' => '本を返却する', 'content' => '図書館に「達人プログラマー」を返す'],
            ['title' => 'Nuxt の勉強', 'content' => 'runtimeConfig と useRuntimeConfig の使い分けを整理する'],
            ['title' => 'Laravel の勉強', 'content' => 'Eloquent のリレーションを一通り触る'],
            ['title' => 'ジムに行く', 'content' => '胸トレ・腕トレ・有酸素20分'],
            ['title' => '掃除機をかける', 'content' => 'リビングと寝室'],
        ];

        foreach ($samples as $sample) {
            $user->todos()->create($sample);
        }
    }
}
