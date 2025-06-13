<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // User::factory()->create();
        // Insert a specific user record
        DB::table('users')->insert([
            'fullname' => 'Administrator',
            'username' => 'admin@gmail.com',
            'ScreenName' => 'Administrator',
            'password' => bcrypt('root12345'), // Don't forget to hash the password
            'activation_code' => rand(100000, 999999),
            'status' => 'Active',
            'CanReceiveBinaryPayouts' => 'Y',
            'LoginIP' => '192.168.1.1',
            'LoginStatus' => 1,
            'Token' =>  Str::random(60),
            'TimeStamp' => now(),
            'ParentID' => 0,
            'ChildId' => 0,
            'PlaceReferralOn' => 'Left',
            'Leg' => 'Right',
            'Referral' => 'Administrator',
            'sponsor' => 'Administrator',
            'WalletBalance' => 100.50,
            'role' => '1',
            'support' => 0,
        ]);
    }
}
