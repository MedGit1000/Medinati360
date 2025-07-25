<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Groupe 1: Infrastructure et Voirie
            ['name' => 'Voirie et Chaussée', 'icon' => '🛣️'],
            ['name' => 'Trottoirs et Mobilité Piétonne', 'icon' => '🚶‍♀️'],
            ['name' => 'Éclairage Public', 'icon' => '💡'],

            // Groupe 2: Environnement et Salubrité
            ['name' => 'Gestion des Déchets', 'icon' => '🗑️'],
            ['name' => 'Espaces Verts et Parcs', 'icon' => '🌳'],
            ['name' => 'Nuisances', 'icon' => '🔊'],

            // Groupe 3: Services et Équipements Publics
            ['name' => 'Eau et Assainissement', 'icon' => '💧'],
            ['name' => 'Mobilier Urbain et Équipements', 'icon' => '🏦'],
            ['name' => 'Transport Public', 'icon' => '🚎'],

            // Groupe 4: Sécurité et Vie Communautaire
            ['name' => 'Signalisation et Sécurité Routière', 'icon' => '🚦'],
            ['name' => 'Animaux Errants', 'icon' => '🐕'],
            ['name' => 'Bâtiments et Constructions', 'icon' => '🏗️'],
        ];

        foreach ($categories as $category) {
            // Use updateOrCreate to avoid duplicates on re-seeding
            Category::updateOrCreate(
                ['name' => $category['name']], // Condition for finding the record
                ['icon' => $category['icon']]  // Data to create or update with
            );
        }
    }
}
