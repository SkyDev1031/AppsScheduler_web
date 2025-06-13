<?php

// database/factories/AppUseInfoFactory.php

namespace Database\Factories;

use App\Models\AppUseInfo;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AppUseInfoFactory extends Factory
{
    protected $model = AppUseInfo::class;

    public function definition()
    {
        return [
            'phonenumber' => $this->faker->phoneNumber,
            'username' => $this->faker->userName,
            'app_name' => $this->faker->word,
            'app_start_time' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'app_end_time' => $this->faker->dateTimeBetween('now', '+1 hour'),
            'app_duration' => $this->faker->time(),  // Random time, adjust if needed
            'app_scheduled_flag' => $this->faker->numberBetween(0, 1),  // Can be either 0 or 1
            'saved_time' => $this->faker->dateTimeThisYear,
        ];
    }
}

