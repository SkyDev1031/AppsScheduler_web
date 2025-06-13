<?php

namespace Database\Seeders;

use App\Models\TblTwilioSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            AdminSettingsSeeder::class,
            AdminTemplateSettingsSeeder::class,
            AppUserSeeder::class,
            PhoneUseInfoSeeder::class,
            AppUseInfoSeeder::class,
            PhoneUseInfoSeeder::class
        ]);
    }
}
