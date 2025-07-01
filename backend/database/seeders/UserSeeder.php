<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un utilisateur spécifique pour les tests
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'), // mot de passe : "password"
        ]);

        // Créer 10 autres utilisateurs aléatoires
        User::factory(10)->create();
    }
}
