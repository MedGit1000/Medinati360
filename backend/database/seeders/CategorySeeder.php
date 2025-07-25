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
            ['name' => 'Signalisation et Sécurité Routière', 'icon' => '🚦'],
            ['name' => 'Mobilier Urbain et Équipements', 'icon' => '🏦'],

            // Groupe 2: Environnement et Salubrité
            ['name' => 'Gestion des Déchets', 'icon' => '🗑️'],
            ['name' => 'Espaces Verts et Parcs', 'icon' => '🌳'],
            ['name' => 'Pollution et Nuisances', 'icon' => '💨'], // Nuisances becomes Pollution et Nuisances
            ['name' => 'Animaux Errants', 'icon' => '🐕'],

            // Groupe 3: Services Publics & Réseaux
            ['name' => 'Eau et Assainissement', 'icon' => '💧'],
            ['name' => 'Transport Public', 'icon' => '🚎'],
            ['name' => 'Panne de Réseau Électrique', 'icon' => '⚡'],
            ['name' => 'Panne de Réseau Internet/Mobile', 'icon' => '📶'],
            ['name' => 'Guichet Automatique (GAB) en panne', 'icon' => '🏧'], // As requested
            ['name' => 'Services Postaux', 'icon' => '📮'],

            // Groupe 4: Constructions & Sécurité
            ['name' => 'Bâtiments et Constructions', 'icon' => '🏗️'],
            ['name' => 'Stationnement Illégal / Gênant', 'icon' => '🅿️'],
            ['name' => 'Vandalisme et Graffiti', 'icon' => '🎨'],
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
