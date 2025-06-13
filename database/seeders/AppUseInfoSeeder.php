<?php

// database/seeders/AppUseInfoSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppUseInfo;

class AppUseInfoSeeder extends Seeder
{
    public function run()
    {
        // Creates 50 app_use_info records with fake data
        AppUseInfo::factory()->create();
    }
}
