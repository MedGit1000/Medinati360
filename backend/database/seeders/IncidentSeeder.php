<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Incident;
use App\Models\User;
use App\Models\Category;

class IncidentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();

        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->info('No users or categories found, skipping incident seeding.');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            Incident::create([
                'user_id' => $users->random()->id,
                'category_id' => $categories->random()->id,
                'title' => fake()->sentence(),
                'description' => fake()->paragraph(),
                'latitude' => fake()->latitude(33.9, 34.1), // Coordonnées autour de Rabat
                'longitude' => fake()->longitude(-6.9, -6.7),
                'status' => fake()->randomElement(['Reçu', 'En cours', 'Résolu']),
            ]);
        }
    }
}
