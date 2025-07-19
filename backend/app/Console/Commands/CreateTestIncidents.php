<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Category;
use App\Models\Incident;

class CreateTestIncidents extends Command
{
    protected $signature = 'app:create-test-incidents'; // Your command name

    protected $description = 'Creates two test incidents for dev purposes';

    public function handle()
    {
        $user = User::find(2);
        $category = Category::first();

        if ($user && $category) {
            Incident::create([
                'title' => 'Test Incident 1 - Approved',
                'description' => 'This is an approved incident',
                'status' => 'Reçu',
                'latitude' => 33.9716,
                'longitude' => -6.8498,
                'user_id' => $user->id,
                'category_id' => $category->id,
                'is_approved' => true
            ]);

            Incident::create([
                'title' => 'Test Incident 2 - Pending',
                'description' => 'This is a pending incident',
                'status' => 'Reçu',
                'latitude' => 33.9716,
                'longitude' => -6.8498,
                'user_id' => $user->id,
                'category_id' => $category->id,
                'is_approved' => false
            ]);

            $this->info('Two incidents created successfully.'); // Use info() to write to the console
        } else {
            $this->error('Could not find User with ID 2 or a Category.'); // Use error() for errors
        }
        return 0;
    }
}
