<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecommendedSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recommended_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recommendation_id')->constrained('recommendations')->onDelete('cascade');
            $table->string('app_packages');         // comma-separated package names
            $table->string('app_schedule_days');    // comma-separated days (e.g. Mon,Tue)
            $table->string('app_schedule_times');   // comma-separated times (e.g. 14:00,18:00)
            $table->timestamps();
        });        
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recommended_schedules');
    }
}
