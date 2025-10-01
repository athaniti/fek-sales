<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingRule extends Model
{
    protected $fillable = [
        'name', 'fek_type', 'price_per_page', 'price_per_color_page',
        'price_per_map', 'minimum_price', 'priority', 'is_active'
    ];

    protected $casts = [
        'price_per_page' => 'decimal:2',
        'price_per_color_page' => 'decimal:2',
        'price_per_map' => 'decimal:2',
        'minimum_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function calculatePrice(array $fekData): float
    {
        $price = 0;

        // Βασική τιμή ανά σελίδα
        $price += $fekData['total_pages'] * $this->price_per_page;

        // Πρόσθετη χρέωση για έγχρωμες σελίδες
        if ($this->price_per_color_page && isset($fekData['color_pages'])) {
            $price += $fekData['color_pages'] * $this->price_per_color_page;
        }

        // Πρόσθετη χρέωση για χάρτες
        if ($this->price_per_map && isset($fekData['maps_count'])) {
            $price += $fekData['maps_count'] * $this->price_per_map;
        }

        return max($price, $this->minimum_price);
    }
}
