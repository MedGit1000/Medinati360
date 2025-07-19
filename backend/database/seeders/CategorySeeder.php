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
            ['name' => 'Voirie & Circulation', 'icon' => '🚗'],
            ['name' => 'Propreté & Environnement', 'icon' => '🧹'],
            ['name' => 'Éclairage Public', 'icon' => '💡'],
            ['name' => 'Espaces Verts & Parcs', 'icon' => '🌳'],
            ['name' => 'Sécurité & Ordre Public', 'icon' => '👮'],
            ['name' => 'Services & Infrastructures', 'icon' => '💧'],
        ];

        foreach ($categories as $category) {
            // Utiliser updateOrCreate pour éviter les doublons
            Category::updateOrCreate(
                ['name' => $category['name']], // Condition de recherche
                ['icon' => $category['icon']]  // Données à mettre à jour ou créer
            );
        }
    }
}
