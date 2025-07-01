<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create(['name' => 'Voirie']);
        Category::create(['name' => 'Propreté']);
        Category::create(['name' => 'Éclairage Public']);
        Category::create(['name' => 'Espaces Verts']);
    }
}
