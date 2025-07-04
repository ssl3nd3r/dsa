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
                'name' => 'Maya',
                'email' => 'mayad@dsa.ae',
            ],
            [
                'name' => 'Client',
                'email' => 'client@dsa.ae',
            ],
            [
                'name' => 'Vendor',
                'email' => 'vendor@dsa.ae',
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
