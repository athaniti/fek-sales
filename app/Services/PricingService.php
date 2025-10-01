<?php
namespace App\Services;

use App\Models\PricingRule;

class PricingService
{
    public function calculateFekPrice(array $fekData): array
    {
        $fekType = $fekData['fek_type'] ?? null;

        // Εύρεση κατάλληλου κανόνα τιμολόγησης
        $rule = PricingRule::where('is_active', true)
            ->where(function ($query) use ($fekType) {
                $query->where('fek_type', $fekType)
                      ->orWhereNull('fek_type');
            })
            ->orderBy('priority', 'desc')
            ->first();

        if (!$rule) {
            // Default τιμολόγηση αν δεν υπάρχει κανόνας
            $price = ($fekData['total_pages'] ?? 0) * 0.50;
            
            return [
                'price' => round($price, 2),
                'rule_id' => null,
                'breakdown' => [
                    'base_pages' => $fekData['total_pages'] ?? 0,
                    'price_per_page' => 0.50,
                ]
            ];
        }

        $price = $rule->calculatePrice($fekData);

        return [
            'price' => round($price, 2),
            'rule_id' => $rule->id,
            'breakdown' => [
                'base_pages' => $fekData['total_pages'] ?? 0,
                'color_pages' => $fekData['color_pages'] ?? 0,
                'maps_count' => $fekData['maps_count'] ?? 0,
                'price_per_page' => $rule->price_per_page,
                'price_per_color_page' => $rule->price_per_color_page,
                'price_per_map' => $rule->price_per_map,
            ]
        ];
    }
}