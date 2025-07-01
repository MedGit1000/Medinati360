<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Supprimez toutes les autres lignes qui pourraient être ici

        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            IncidentSeeder::class,
        ]);
    }
}
