<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceiptItem extends Model
{
    protected $fillable = [
        'receipt_id', 'item_type', 'fek_number', 'fek_type', 'fek_date',
        'fek_title', 'total_pages', 'color_pages', 'maps_count',
        'product_id', 'description', 'quantity', 'unit_price',
        'total_price', 'price_manually_adjusted'
    ];

    protected $casts = [
        'fek_date' => 'date',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'price_manually_adjusted' => 'boolean',
    ];

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function isFek(): bool
    {
        return $this->item_type === 'fek';
    }
}