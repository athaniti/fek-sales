<?php

// app/Http/Controllers/ReceiptController.php
namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Services\ReceiptService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReceiptController extends Controller
{
    public function __construct(private ReceiptService $receiptService) {}

    public function index(Request $request)
{
    $query = Receipt::with(['user', 'items'])
        ->orderBy('created_at', 'desc');

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    if ($request->filled('date_from')) {
        $query->whereDate('created_at', '>=', $request->date_from);
    }

    if ($request->filled('date_to')) {
        $query->whereDate('created_at', '<=', $request->date_to);
    }

    $receipts = $query->paginate(50);

    if ($request->wantsJson()) {
        return response()->json(['success' => true, 'data' => $receipts]);
    }

    return view('receipts.index', compact('receipts'));
}

public function show(Receipt $receipt)
{
    $receipt->load(['items.product', 'user', 'cancelledBy']);

    if (request()->wantsJson()) {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $receipt->id,
                'receipt_number' => $receipt->receipt_number,
                'total_amount' => (float) $receipt->total_amount,
                'discount' => (float) $receipt->discount,
                'final_amount' => (float) $receipt->final_amount,
                'status' => $receipt->status,
                'created_at' => $receipt->created_at->toISOString(),
                'user' => $receipt->user,
                'items' => $receipt->items->map(function($item) {
                    return $item->toFrontendFormat();
                }),
            ]
        ]);
    }

    return view('receipts.show', compact('receipt'));
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:fek,book,cd,product,other',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
            'items.*.price_manually_adjusted' => 'nullable|boolean',
            'items.*.fek_number' => 'nullable|string',
            'items.*.fek_type' => 'nullable|string',
            'items.*.fek_date' => 'nullable|date',
            'items.*.fek_title' => 'nullable|string',
            'items.*.total_pages' => 'nullable|integer',
            'items.*.color_pages' => 'nullable|integer',
            'items.*.maps_count' => 'nullable|integer',
            'items.*.product_id' => 'nullable|exists:products,id',
            'discount' => 'nullable|numeric|min:0',
            'customer' => 'nullable|array',
        ]);

        try {
            $receipt = $this->receiptService->createReceipt(
                $validated['items'],
                $validated['discount'] ?? 0
            );

            return response()->json([
                'success' => true,
                'message' => 'Η απόδειξη δημιουργήθηκε επιτυχώς',
                'data' => [
                    'id' => $receipt->id,
                    'receipt_number' => $receipt->receipt_number,
                    'total_amount' => (float) $receipt->total_amount,
                    'discount' => (float) $receipt->discount,
                    'final_amount' => (float) $receipt->final_amount,
                    'status' => $receipt->status,
                    'created_at' => $receipt->created_at->toISOString(),
                    'items' => $receipt->items->map(function($item) {
                        return $item->toFrontendFormat();
                    }),
                    'customer' => $validated['customer'] ?? null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function cancel(Receipt $receipt, Request $request)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->receiptService->cancelReceipt($receipt, $validated['reason']);

            return response()->json([
                'success' => true,
                'message' => 'Η απόδειξη ακυρώθηκε επιτυχώς'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function print(Receipt $receipt)
    {
        $receipt->load(['items', 'user']);
        return view('receipts.print', compact('receipt'));
    }
}
