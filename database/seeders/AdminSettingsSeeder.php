<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminSettings;

class AdminSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a single admin settings entry
        AdminSettings::factory()->create();

        // Optionally, create multiple admin settings entries
        // AdminSetting::factory()->count(10)->create();
    }
}
