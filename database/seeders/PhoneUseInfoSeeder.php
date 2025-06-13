<?php

// database/seeders/PhoneUseInfoSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PhoneUseInfo;

class PhoneUseInfoSeeder extends Seeder
{
    public function run()
    {
        // Generate 50 records (you can adjust the number as needed)
        PhoneUseInfo::factory()->create();
    }
}
