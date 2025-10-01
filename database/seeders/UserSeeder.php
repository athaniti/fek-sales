<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'email' => 'admin@et.gr',
                'full_name' => 'Διαχειριστής Συστήματος',
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Create operator user
        User::updateOrCreate(
            ['username' => 'operator1'],
            [
                'email' => 'operator1@et.gr',
                'full_name' => 'Χειριστής Πωλήσεων',
                'role' => 'operator',
                'is_active' => true,
            ]
        );

        echo "✓ Users created successfully!\n";
        echo "  - admin (role: admin)\n";
        echo "  - operator1 (role: operator)\n";
        echo "  Password for testing: test123\n";
    }
}
