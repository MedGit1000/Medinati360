<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('description');
            $table->string('photo_path')->nullable();
            $table->string('status')->default('Reçu');

            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            // --- Clés Étrangères ---
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // <-- LIGNE AJOUTÉE

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
