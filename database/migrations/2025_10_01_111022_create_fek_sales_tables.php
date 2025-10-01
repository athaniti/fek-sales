<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Product Categories
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('base_price', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Pricing Rules
        Schema::create('pricing_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('fek_type')->nullable();
            $table->decimal('price_per_page', 10, 2);
            $table->decimal('price_per_color_page', 10, 2)->nullable();
            $table->decimal('price_per_map', 10, 2)->nullable();
            $table->decimal('minimum_price', 10, 2)->default(0);
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('product_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Receipts
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('final_amount', 10, 2);
            $table->enum('status', ['completed', 'cancelled'])->default('completed');
            $table->timestamp('cancelled_at')->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('cancellation_reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 5. Receipt Items
        Schema::create('receipt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_id')->constrained()->onDelete('cascade');
            $table->enum('item_type', ['fek', 'product']);
            $table->string('fek_number')->nullable();
            $table->string('fek_type')->nullable();
            $table->date('fek_date')->nullable();
            $table->string('fek_title')->nullable();
            $table->integer('total_pages')->nullable();
            $table->integer('color_pages')->nullable();
            $table->integer('maps_count')->nullable();
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->string('description');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->boolean('price_manually_adjusted')->default(false);
            $table->timestamps();
        });

        // 6. Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action');
            $table->string('entity_type')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
            $table->index('created_at');
        });

        // 7. FEK Cache
        Schema::create('fek_cache', function (Blueprint $table) {
            $table->id();
            $table->string('fek_number');
            $table->string('fek_type');
            $table->date('fek_date');
            $table->string('title');
            $table->integer('total_pages');
            $table->integer('color_pages')->default(0);
            $table->integer('maps_count')->default(0);
            $table->boolean('has_images')->default(false);
            $table->string('pdf_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('cached_at')->useCurrent();
            $table->timestamps();

            $table->unique(['fek_number', 'fek_type', 'fek_date']);
            $table->index('fek_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_items');
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('products');
        Schema::dropIfExists('fek_cache');
        Schema::dropIfExists('pricing_rules');
        Schema::dropIfExists('product_categories');
    }
};
