<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppusersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appusers', function (Blueprint $table) {
            $table->id();
            $table->string('userID');
            $table->string('phonenumber')->unique(); // Already present, no need for a second migration
            $table->string('password');
            $table->enum('status', ['Pending', 'Active', 'Disenrolled'])->default('Pending');
            $table->string('fcm_token')->nullable();
            $table->foreignId('study_id')->nullable()->constrained('studies')->onDelete('set null');
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
        Schema::dropIfExists('appusers');
    }
}
