<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'lilrez121@gmail.com',
            'password' => Hash::make('mama123AZE'), // Use a strong password!
            'role' => 'superadmin',
        ]);
    }
}
