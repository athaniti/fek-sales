<?php

// app/Http/Controllers/ReceiptController.php
namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Services\ReceiptService;
use Illuminate\Http\Request;

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
        return response()->json(['success' => true, 'data' => $receipt]);
    }

    return view('receipts.show', compact('receipt'));
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:fek,product',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
            'items.*.price_manually_adjusted' => 'boolean',
            'items.*.fek_number' => 'required_if:items.*.type,fek',
            'items.*.fek_type' => 'required_if:items.*.type,fek',
            'items.*.fek_date' => 'required_if:items.*.type,fek|date',
            'items.*.product_id' => 'required_if:items.*.type,product|exists:products,id',
            'discount' => 'nullable|numeric|min:0',
        ]);

        try {
            $receipt = $this->receiptService->createReceipt(
                $validated['items'],
                $validated['discount'] ?? 0
            );

            return response()->json([
                'success' => true,
                'message' => 'Η απόδειξη δημιουργήθηκε επιτυχώς',
                'data' => $receipt
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
