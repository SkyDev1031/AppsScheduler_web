<?php

// database/seeders/AppUserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppUser;

class AppUserSeeder extends Seeder
{
    public function run()
    {
        // Creates 50 appuser records with fake data
        AppUser::factory()->create();
    }
}
