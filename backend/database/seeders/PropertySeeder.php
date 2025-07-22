<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users or create some if none exist
        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        // Create a variety of properties
        $this->createStudioProperties($users);
        $this->createFamilyProperties($users);
        $this->createLuxuryProperties($users);
        $this->createSharedAccommodations($users);
        $this->createBudgetProperties($users);
    }

    /**
     * Create studio properties
     */
    private function createStudioProperties($users): void
    {
        $locations = [
            'Dubai Marina', 'Downtown Dubai (Downtown, DT)', 'Palm Jumeirah (Palm)', 'JBR (Jumeirah Beach Residence)', 'Business Bay', 'Dubai Hills Estate (Hills)', 'Arabian Ranches (Ranches)', 'Emirates Hills', 'Meadows', 'Springs', 'Lakes', 'JLT (Jumeirah Lake Towers)', 'DIFC (Financial Centre)', 'Sheikh Zayed Road (SZR)', 'Al Barsha (Barsha)', 'Mirdif', 'Deira (Old Dubai)', 'Bur Dubai (Old Dubai)', 'Al Quoz', 'Al Safa', 'Umm Suqeim (Jumeirah/Umm Suqeim)', 'Al Warqa', 'International City (IC)', 'Dubai Silicon Oasis (DSO)', 'Al Furjan', 'Jumeirah Village Circle (JVC)', 'Jumeirah Village Triangle (JVT)', 'Dubai Sports City (DSC)', 'Dubai Production City (IMPZ)', 'Al Nahda', 'Discovery Gardens', 'Al Khawaneej', 'Nad Al Sheba (NAS)', 'Jumeirah Golf Estates (JGE)', 'Motor City', 'Dubai Land (Dubailand)', 'Town Square (NSHAMA)', 'Majan', 'Al Mizhar', 'Al Rashidiya (Rashidiya)', 'The Greens', 'The Views', 'Satwa (Al Satwa)', 'Al Wasl', 'Zabeel (Zabeel 1 & 2)', 'Barsha Heights (Tecom)', 'Dubai Investment Park (DIP)', 'Dubai Creek Harbour (Creek)', 'Al Jaddaf', 'Dubai Festival City (DFC)'
        ];

        for ($i = 0; $i < 15; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Entire Place';
            $propertyType = 'Studio';
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->studio()
                ->available()
                ->create([
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'room_type' => $roomType,
                    'property_type' => $propertyType,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }
    }

    /**
     * Create family properties (2BR, 3BR, 4BR+)
     */
    private function createFamilyProperties($users): void
    {
        $locations = [
            'Dubai Marina', 'Downtown Dubai (Downtown, DT)', 'Palm Jumeirah (Palm)', 'JBR (Jumeirah Beach Residence)', 'Business Bay', 'Dubai Hills Estate (Hills)', 'Arabian Ranches (Ranches)', 'Emirates Hills', 'Meadows', 'Springs', 'Lakes', 'JLT (Jumeirah Lake Towers)', 'DIFC (Financial Centre)', 'Sheikh Zayed Road (SZR)', 'Al Barsha (Barsha)', 'Mirdif', 'Deira (Old Dubai)', 'Bur Dubai (Old Dubai)', 'Al Quoz', 'Al Safa', 'Umm Suqeim (Jumeirah/Umm Suqeim)', 'Al Warqa', 'International City (IC)', 'Dubai Silicon Oasis (DSO)', 'Al Furjan', 'Jumeirah Village Circle (JVC)', 'Jumeirah Village Triangle (JVT)', 'Dubai Sports City (DSC)', 'Dubai Production City (IMPZ)', 'Al Nahda', 'Discovery Gardens', 'Al Khawaneej', 'Nad Al Sheba (NAS)', 'Jumeirah Golf Estates (JGE)', 'Motor City', 'Dubai Land (Dubailand)', 'Town Square (NSHAMA)', 'Majan', 'Al Mizhar', 'Al Rashidiya (Rashidiya)', 'The Greens', 'The Views', 'Satwa (Al Satwa)', 'Al Wasl', 'Zabeel (Zabeel 1 & 2)', 'Barsha Heights (Tecom)', 'Dubai Investment Park (DIP)', 'Dubai Creek Harbour (Creek)', 'Al Jaddaf', 'Dubai Festival City (DFC)'
        ];

        // 2BR properties
        for ($i = 0; $i < 20; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Entire Place';
            $propertyType = '2BR';
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->available()
                ->create([
                    'property_type' => $propertyType,
                    'bedrooms' => 2,
                    'bathrooms' => 2,
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'room_type' => $roomType,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }

        // 3BR properties
        for ($i = 0; $i < 15; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Entire Place';
            $propertyType = '3BR';
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->available()
                ->create([
                    'property_type' => $propertyType,
                    'bedrooms' => 3,
                    'bathrooms' => 3,
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'room_type' => $roomType,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }

        // 4BR+ properties
        for ($i = 0; $i < 10; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Entire Place';
            $propertyType = '4BR+';
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->available()
                ->create([
                    'property_type' => $propertyType,
                    'bedrooms' => 4,
                    'bathrooms' => 4,
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'room_type' => $roomType,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }
    }

    /**
     * Create luxury properties
     */
    private function createLuxuryProperties($users): void
    {
        $locations = [
            'Dubai Marina', 'Downtown Dubai (Downtown, DT)', 'Palm Jumeirah (Palm)', 'JBR (Jumeirah Beach Residence)', 'Business Bay', 'Dubai Hills Estate (Hills)', 'Arabian Ranches (Ranches)', 'Emirates Hills', 'Meadows', 'Springs', 'Lakes', 'JLT (Jumeirah Lake Towers)', 'DIFC (Financial Centre)', 'Sheikh Zayed Road (SZR)', 'Al Barsha (Barsha)', 'Mirdif', 'Deira (Old Dubai)', 'Bur Dubai (Old Dubai)', 'Al Quoz', 'Al Safa', 'Umm Suqeim (Jumeirah/Umm Suqeim)', 'Al Warqa', 'International City (IC)', 'Dubai Silicon Oasis (DSO)', 'Al Furjan', 'Jumeirah Village Circle (JVC)', 'Jumeirah Village Triangle (JVT)', 'Dubai Sports City (DSC)', 'Dubai Production City (IMPZ)', 'Al Nahda', 'Discovery Gardens', 'Al Khawaneej', 'Nad Al Sheba (NAS)', 'Jumeirah Golf Estates (JGE)', 'Motor City', 'Dubai Land (Dubailand)', 'Town Square (NSHAMA)', 'Majan', 'Al Mizhar', 'Al Rashidiya (Rashidiya)', 'The Greens', 'The Views', 'Satwa (Al Satwa)', 'Al Wasl', 'Zabeel (Zabeel 1 & 2)', 'Barsha Heights (Tecom)', 'Dubai Investment Park (DIP)', 'Dubai Creek Harbour (Creek)', 'Al Jaddaf', 'Dubai Festival City (DFC)'
        ];

        for ($i = 0; $i < 8; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Entire Place';
            $propertyType = fake()->randomElement(['2BR', '3BR', '4BR+']);
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->luxury()
                ->available()
                ->create([
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'room_type' => $roomType,
                    'property_type' => $propertyType,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }
    }

    /**
     * Create shared accommodations
     */
    private function createSharedAccommodations($users): void
    {
        $locations = [
            'Dubai Marina', 'Downtown Dubai (Downtown, DT)', 'Palm Jumeirah (Palm)', 'JBR (Jumeirah Beach Residence)', 'Business Bay', 'Dubai Hills Estate (Hills)', 'Arabian Ranches (Ranches)', 'Emirates Hills', 'Meadows', 'Springs', 'Lakes', 'JLT (Jumeirah Lake Towers)', 'DIFC (Financial Centre)', 'Sheikh Zayed Road (SZR)', 'Al Barsha (Barsha)', 'Mirdif', 'Deira (Old Dubai)', 'Bur Dubai (Old Dubai)', 'Al Quoz', 'Al Safa', 'Umm Suqeim (Jumeirah/Umm Suqeim)', 'Al Warqa', 'International City (IC)', 'Dubai Silicon Oasis (DSO)', 'Al Furjan', 'Jumeirah Village Circle (JVC)', 'Jumeirah Village Triangle (JVT)', 'Dubai Sports City (DSC)', 'Dubai Production City (IMPZ)', 'Al Nahda', 'Discovery Gardens', 'Al Khawaneej', 'Nad Al Sheba (NAS)', 'Jumeirah Golf Estates (JGE)', 'Motor City', 'Dubai Land (Dubailand)', 'Town Square (NSHAMA)', 'Majan', 'Al Mizhar', 'Al Rashidiya (Rashidiya)', 'The Greens', 'The Views', 'Satwa (Al Satwa)', 'Al Wasl', 'Zabeel (Zabeel 1 & 2)', 'Barsha Heights (Tecom)', 'Dubai Investment Park (DIP)', 'Dubai Creek Harbour (Creek)', 'Al Jaddaf', 'Dubai Festival City (DFC)'
        ];

        // Shared rooms
        for ($i = 0; $i < 12; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Shared Room';
            $propertyType = fake()->randomElement(['1BR', '2BR', '3BR', '4BR+', 'Studio']);
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->available()
                ->create([
                    'property_type' => $propertyType,
                    'room_type' => $roomType,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }

        // Private rooms
        for ($i = 0; $i < 10; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Private Room';
            $propertyType = fake()->randomElement(['1BR', '2BR', '3BR', '4BR+', 'Studio']);
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->available()
                ->create([
                    'property_type' => $propertyType,
                    'room_type' => $roomType,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'location' => $location,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }
    }

    /**
     * Create budget properties
     */
    private function createBudgetProperties($users): void
    {
        $locations = [
            'Dubai Marina', 'Downtown Dubai (Downtown, DT)', 'Palm Jumeirah (Palm)', 'JBR (Jumeirah Beach Residence)', 'Business Bay', 'Dubai Hills Estate (Hills)', 'Arabian Ranches (Ranches)', 'Emirates Hills', 'Meadows', 'Springs', 'Lakes', 'JLT (Jumeirah Lake Towers)', 'DIFC (Financial Centre)', 'Sheikh Zayed Road (SZR)', 'Al Barsha (Barsha)', 'Mirdif', 'Deira (Old Dubai)', 'Bur Dubai (Old Dubai)', 'Al Quoz', 'Al Safa', 'Umm Suqeim (Jumeirah/Umm Suqeim)', 'Al Warqa', 'International City (IC)', 'Dubai Silicon Oasis (DSO)', 'Al Furjan', 'Jumeirah Village Circle (JVC)', 'Jumeirah Village Triangle (JVT)', 'Dubai Sports City (DSC)', 'Dubai Production City (IMPZ)', 'Al Nahda', 'Discovery Gardens', 'Al Khawaneej', 'Nad Al Sheba (NAS)', 'Jumeirah Golf Estates (JGE)', 'Motor City', 'Dubai Land (Dubailand)', 'Town Square (NSHAMA)', 'Majan', 'Al Mizhar', 'Al Rashidiya (Rashidiya)', 'The Greens', 'The Views', 'Satwa (Al Satwa)', 'Al Wasl', 'Zabeel (Zabeel 1 & 2)', 'Barsha Heights (Tecom)', 'Dubai Investment Park (DIP)', 'Dubai Creek Harbour (Creek)', 'Al Jaddaf', 'Dubai Festival City (DFC)'
        ];

        for ($i = 0; $i < 10; $i++) {
            $location = fake()->randomElement($locations);
            $roomType = 'Entire Place';
            $propertyType = fake()->randomElement(['Studio', '1BR', '2BR']);
            $title = "{$roomType} - {$propertyType} in {$location}";
            $slug = Property::createUniqueSlug($title);
            
            Property::factory()
                ->available()
                ->create([
                    'price' => fake()->numberBetween(2000, 5000),
                    'location' => $location,
                    'amenities' => fake()->randomElements([
                        'WiFi', 'Air Conditioning', 'Parking', 'Public Transport'
                    ], fake()->numberBetween(2, 4)),
                    'owner_id' => $users->whereIn('email', [
                        'vendor@dsa.ae',
                        'vendor2@dsa.ae',
                        'vendor3@dsa.ae',
                        'vendor4@dsa.ae',
                        'vendor5@dsa.ae',
                        'vendor6@dsa.ae',
                        'vendor7@dsa.ae',
                        'vendor8@dsa.ae',
                        'vendor9@dsa.ae',
                    ])->random()->id,
                    'room_type' => $roomType,
                    'property_type' => $propertyType,
                    'title' => $title,
                    'slug' => $slug,
                ]);
        }
    }
} 