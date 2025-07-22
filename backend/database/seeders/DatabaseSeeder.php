<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Mayad',
                'email' => 'mayad@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor2@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor3@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor4@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor5@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor6@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor7@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor8@dsa.ae',
            ],
            [
                'name' => fake()->name(),
                'email' => 'vendor9@dsa.ae',
            ],
            [
                'name' => 'Jimmy',
                'email' => 'jimmy@dsa.ae',
            ],
        ];

        foreach ($users as $userData) {
            User::factory()->create($userData);
        }

        // Call the PropertySeeder
        $this->call([
            PropertySeeder::class,
        ]);
    }
}
