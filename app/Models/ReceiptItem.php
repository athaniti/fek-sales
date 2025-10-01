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

    public function isBook(): bool
    {
        return $this->item_type === 'book';
    }

    public function isCd(): bool
    {
        return $this->item_type === 'cd';
    }

    public function isProduct(): bool
    {
        return $this->item_type === 'product';
    }

    /**
     * Transform the receipt item for frontend consumption
     */
    public function toFrontendFormat(): array
    {
        $base = [
            'id' => $this->id,
            'type' => $this->item_type,
            'name' => $this->description,
            'description' => $this->description,
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'total_price' => (float) $this->total_price,
        ];

        // Add type-specific metadata
        if ($this->isFek()) {
            $base['metadata'] = [
                'issue_number' => $this->fek_number,
                'type' => $this->fek_type,
                'date' => $this->fek_date ? $this->fek_date->format('Y-m-d') : null,
                'total_pages' => $this->total_pages,
                'color_pages' => $this->color_pages,
                'maps_count' => $this->maps_count,
            ];
        }

        return $base;
    }
}
