<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminTemplateSettings;

class AdminTemplateSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Seed specific values
        AdminTemplateSettings::factory()->create([
            'field' => 'isRegistration',
            'value' => 1, // You can specify the exact value here
        ]);

        AdminTemplateSettings::factory()->create([
            'field' => 'register',
            'value' => 100, // You can specify another exact value here
        ]);

        // Optionally, you can add more records if needed, 
        // such as creating random data within your constraints:
        // AdminTemplateSetting::factory()->count(10)->create();
    }
}
