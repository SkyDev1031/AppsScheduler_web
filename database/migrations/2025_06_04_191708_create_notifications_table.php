<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('id'); // Primary key
            $table->foreignId('participant_id')->constrained('appusers'); // assuming researchers are users
            $table->foreignId('researcher_id')->constrained('users')->onDelete('cascade'); // assuming researchers are users
            $table->string('title');        // Notification title
            $table->text('content');        // Notification content
            $table->boolean('read_status')->default(false); // Whether notification is read
            $table->timestamp('accept_time')->nullable();   // When notification was accepted
            $table->timestamp('read_time')->nullable();     // When notification was read
            $table->timestamps();          // created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
