<?php
namespace App\Services;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportService
{
    public function getDailySales(Carbon $date): array
    {
        return $this->getSalesReport($date, $date);
    }

    public function getMonthlySales(int $year, int $month): array
    {
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        return $this->getSalesReport($startDate, $endDate);
    }

    public function getYearlySales(int $year): array
    {
        $startDate = Carbon::create($year, 1, 1)->startOfYear();
        $endDate = $startDate->copy()->endOfYear();

        return $this->getSalesReport($startDate, $endDate);
    }

    private function getSalesReport(Carbon $startDate, Carbon $endDate): array
    {
        $receipts = Receipt::whereBetween('created_at', [$startDate, $endDate])
            ->with(['items', 'user'])
            ->get();

        $summary = [
            'period' => [
                'start' => $startDate->format('d/m/Y'),
                'end' => $endDate->format('d/m/Y'),
            ],
            'total_receipts' => $receipts->count(),
            'completed_receipts' => $receipts->where('status', 'completed')->count(),
            'cancelled_receipts' => $receipts->where('status', 'cancelled')->count(),
            'total_amount' => $receipts->where('status', 'completed')->sum('final_amount'),
            'total_discount' => $receipts->where('status', 'completed')->sum('discount'),
        ];

        // Ανάλυση ανά τύπο προϊόντος
        $itemsByType = ReceiptItem::whereIn('receipt_id', 
                $receipts->where('status', 'completed')->pluck('id')
            )
            ->select('item_type', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_price) as total'))
            ->groupBy('item_type')
            ->get();

        $summary['by_type'] = $itemsByType->mapWithKeys(function ($item) {
            return [$item->item_type => [
                'count' => $item->count,
                'total' => $item->total,
            ]];
        })->toArray();

        // Ανάλυση ΦΕΚ ανά τύπο
        $fekByType = ReceiptItem::whereIn('receipt_id', 
                $receipts->where('status', 'completed')->pluck('id')
            )
            ->where('item_type', 'fek')
            ->select('fek_type', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_price) as total'))
            ->groupBy('fek_type')
            ->get();

        $summary['fek_by_type'] = $fekByType->mapWithKeys(function ($item) {
            return [$item->fek_type => [
                'count' => $item->count,
                'total' => $item->total,
            ]];
        })->toArray();

        $summary['receipts'] = $receipts->map(function ($receipt) {
            return [
                'receipt_number' => $receipt->receipt_number,
                'date' => $receipt->created_at->format('d/m/Y H:i'),
                'user' => $receipt->user->full_name,
                'items_count' => $receipt->items->count(),
                'total_amount' => $receipt->total_amount,
                'discount' => $receipt->discount,
                'final_amount' => $receipt->final_amount,
                'status' => $receipt->status,
            ];
        })->toArray();

        return $summary;
    }
}