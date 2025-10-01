<?php
namespace App\Services;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class ReceiptService
{
    public function createReceipt(array $items, ?float $discount = 0): Receipt
    {
        return DB::transaction(function () use ($items, $discount) {
            $totalAmount = 0;

            // Υπολογισμός συνολικού ποσού
            foreach ($items as $item) {
                $totalAmount += $item['total_price'];
            }

            $finalAmount = $totalAmount - $discount;

            // Δημιουργία απόδειξης
            $receipt = Receipt::create([
                'user_id' => auth()->id(),
                'total_amount' => $totalAmount,
                'discount' => $discount,
                'final_amount' => $finalAmount,
                'status' => 'completed',
            ]);

            // Δημιουργία items
            foreach ($items as $item) {
                ReceiptItem::create([
                    'receipt_id' => $receipt->id,
                    'item_type' => $item['type'],
                    'fek_number' => $item['fek_number'] ?? null,
                    'fek_type' => $item['fek_type'] ?? null,
                    'fek_date' => $item['fek_date'] ?? null,
                    'fek_title' => $item['fek_title'] ?? null,
                    'total_pages' => $item['total_pages'] ?? null,
                    'color_pages' => $item['color_pages'] ?? null,
                    'maps_count' => $item['maps_count'] ?? null,
                    'product_id' => $item['product_id'] ?? null,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'] ?? 1,
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'price_manually_adjusted' => $item['price_manually_adjusted'] ?? false,
                ]);
            }

            // Audit log
            AuditLog::log(
                'receipt.created',
                'Receipt',
                $receipt->id,
                null,
                [
                    'receipt_number' => $receipt->receipt_number,
                    'items_count' => count($items),
                    'final_amount' => $finalAmount,
                ]
            );

            return $receipt->load('items');
        });
    }

    public function cancelReceipt(Receipt $receipt, string $reason): bool
    {
        if ($receipt->status === 'cancelled') {
            throw new \Exception('Η απόδειξη είναι ήδη ακυρωμένη');
        }

        return $receipt->cancel(auth()->user(), $reason);
    }
}