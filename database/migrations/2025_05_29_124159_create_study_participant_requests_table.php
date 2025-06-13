<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudyParticipantRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study_participant_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_id')->constrained()->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('appusers')->onDelete('cascade');
            $table->enum('type', ['join', 'leave']);
            $table->enum('study_status', ['Pending', 'Approved', 'Declined'])->default('Pending');
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
        Schema::dropIfExists('study_participant_requests');
    }
}
