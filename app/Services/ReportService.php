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
        $startDate = $date->copy()->startOfDay();
        $endDate = $date->copy()->endOfDay();

        return $this->getSalesReport($startDate, $endDate);
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
            ->where('status', 'completed')
            ->with(['items'])
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = [
            'period' => [
                'start' => $startDate->format('d/m/Y'),
                'end' => $endDate->format('d/m/Y'),
                'title' => $this->getPeriodTitle($startDate, $endDate),
            ],
            'totals' => [
                'receipts_count' => $receipts->count(),
                'total_amount' => round($receipts->sum('final_amount'), 2),
                'discount' => round($receipts->sum('discount'), 2),
                'gross_amount' => round($receipts->sum('total_amount'), 2),
            ],
        ];

        // Συγκεντρωτική ανάλυση ανά τύπο προϊόντος
        $itemsByType = ReceiptItem::whereIn('receipt_id', $receipts->pluck('id'))
            ->select('item_type',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(total_price) as total_amount'))
            ->groupBy('item_type')
            ->orderBy('total_amount', 'desc')
            ->get();

        $summary['items_by_type'] = $itemsByType->map(function ($item) {
            return [
                'type' => $item->item_type,
                'type_label' => $this->getTypeLabel($item->item_type),
                'type_icon' => $this->getTypeIcon($item->item_type),
                'quantity' => (int) $item->total_quantity,
                'total_amount' => round($item->total_amount, 2),
            ];
        })->toArray();

        // Λίστα αποδείξεων (απλοποιημένη)
        $summary['receipts'] = $receipts->map(function ($receipt) {
            return [
                'id' => $receipt->id,
                'receipt_number' => $receipt->receipt_number,
                'date' => $receipt->created_at->format('d/m/Y'),
                'time' => $receipt->created_at->format('H:i'),
                'items_count' => $receipt->items->count(),
                'total_amount' => round($receipt->total_amount, 2),
                'discount' => round($receipt->discount, 2),
                'final_amount' => round($receipt->final_amount, 2),
            ];
        })->toArray();

        return $summary;
    }

    private function getPeriodTitle(Carbon $startDate, Carbon $endDate): string
    {
        if ($startDate->isSameDay($endDate)) {
            return 'Ημερήσια Αναφορά - ' . $startDate->format('d/m/Y');
        }

        if ($startDate->isSameMonth($endDate) && $startDate->day === 1 && $endDate->day === $endDate->daysInMonth) {
            return 'Μηνιαία Αναφορά - ' . $startDate->format('m/Y');
        }

        if ($startDate->month === 1 && $startDate->day === 1 &&
            $endDate->month === 12 && $endDate->day === 31 &&
            $startDate->year === $endDate->year) {
            return 'Ετήσια Αναφορά - ' . $startDate->format('Y');
        }

        return 'Αναφορά Περιόδου - ' . $startDate->format('d/m/Y') . ' έως ' . $endDate->format('d/m/Y');
    }

    private function getTypeLabel(string $type): string
    {
        $typeLabels = [
            'fek' => 'ΦΕΚ',
            'book' => 'Βιβλία',
            'cd' => 'CD',
            'other' => 'Άλλα',
            'product' => 'Προϊόντα'
        ];
        return $typeLabels[$type] ?? $type;
    }

    private function getTypeIcon(string $type): string
    {
        $typeIcons = [
            'fek' => '📄',
            'book' => '📚',
            'cd' => '💿',
            'other' => '📦',
            'product' => '🏪'
        ];
        return $typeIcons[$type] ?? '📋';
    }
}
