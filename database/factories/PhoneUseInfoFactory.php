<?php

// database/factories/PhoneUseInfoFactory.php

namespace Database\Factories;

use App\Models\PhoneUseInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhoneUseInfoFactory extends Factory
{
    protected $model = PhoneUseInfo::class;

    public function definition()
    {
        return [
            'phonenumber' => $this->faker->phoneNumber,
            'username' => $this->faker->userName,
            'phone_frequency_unlock' => $this->faker->randomElement(['Low', 'Medium', 'High']),  // Adjust as needed
            'date' => $this->faker->date(),  // Generates a random date
        ];
    }
}
