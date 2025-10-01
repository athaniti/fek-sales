<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $today = Carbon::today();

        // Today's sales
        $todaySales = Receipt::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->sum('final_amount');

        // Today's receipts count
        $todayReceipts = Receipt::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->count();

        // Today's FEK items count
        $todayFek = ReceiptItem::whereHas('receipt', function($query) use ($today) {
                $query->whereDate('created_at', $today)
                      ->where('status', 'completed');
            })
            ->where('item_type', 'fek')
            ->sum('quantity');

        // Today's other products count (books + CDs)
        $todayProducts = ReceiptItem::whereHas('receipt', function($query) use ($today) {
                $query->whereDate('created_at', $today)
                      ->where('status', 'completed');
            })
            ->whereIn('item_type', ['book', 'cd', 'product'])
            ->sum('quantity');

        return response()->json([
            'success' => true,
            'data' => [
                'today_sales' => (float) $todaySales,
                'today_receipts' => (int) $todayReceipts,
                'today_fek' => (int) $todayFek,
                'today_products' => (int) $todayProducts
            ]
        ]);
    }

    public function recentReceipts(Request $request)
    {
        $limit = $request->get('limit', 5);

        $receipts = Receipt::with(['items', 'user'])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function($receipt) {
                return [
                    'id' => $receipt->id,
                    'receipt_number' => $receipt->receipt_number,
                    'final_amount' => (float) $receipt->final_amount,
                    'created_at' => $receipt->created_at->toISOString(),
                    'items_count' => $receipt->items->count(),
                    'user_name' => $receipt->user ? $receipt->user->name : 'N/A'
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $receipts
        ]);
    }
}
