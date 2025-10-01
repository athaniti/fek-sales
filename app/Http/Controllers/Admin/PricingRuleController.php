<?php

/ app/Http/Controllers/Admin/PricingRuleController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingRule;
use Illuminate\Http\Request;

class PricingRuleController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function index()
    {
        $rules = PricingRule::orderBy('priority', 'desc')->get();
        return view('admin.pricing.index', compact('rules'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fek_type' => 'nullable|string|max:10',
            'price_per_page' => 'required|numeric|min:0',
            'price_per_color_page' => 'nullable|numeric|min:0',
            'price_per_map' => 'nullable|numeric|min:0',
            'minimum_price' => 'nullable|numeric|min:0',
            'priority' => 'nullable|integer',
        ]);

        $rule = PricingRule::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ο κανόνας τιμολόγησης δημιουργήθηκε επιτυχώς',
            'data' => $rule
        ]);
    }

    public function update(Request $request, PricingRule $rule)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fek_type' => 'nullable|string|max:10',
            'price_per_page' => 'required|numeric|min:0',
            'price_per_color_page' => 'nullable|numeric|min:0',
            'price_per_map' => 'nullable|numeric|min:0',
            'minimum_price' => 'nullable|numeric|min:0',
            'priority' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $rule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ο κανόνας τιμολόγησης ενημερώθηκε επιτυχώς',
            'data' => $rule
        ]);
    }
}