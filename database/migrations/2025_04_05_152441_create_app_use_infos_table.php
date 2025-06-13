<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppUseInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_use_infos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('phonenumber', 20);
            $table->string('userID', 50);
            $table->string('app_name', 100);
            $table->dateTime('app_start_time');
            $table->dateTime('app_end_time');
            $table->time('app_duration');
            $table->integer('app_scheduled_flag');
            $table->dateTime('saved_time');
            $table->timestamps();

            $table->unique([
                'phonenumber',
                'userID',
                'app_name',
                'app_start_time',
                'app_end_time',
                'app_duration',
                'app_scheduled_flag',
                'saved_time'
            ], 'unique_app_use_info');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('app_use_infos');
    }
}
