<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receipt extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'receipt_number', 'user_id', 'total_amount', 'discount',
        'final_amount', 'status', 'cancelled_at', 'cancelled_by',
        'cancellation_reason', 'notes'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'cancelled_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($receipt) {
            if (!$receipt->receipt_number) {
                $receipt->receipt_number = self::generateReceiptNumber();
            }
        });
    }

    public static function generateReceiptNumber(): string
    {
        $year = date('Y');
        $lastReceipt = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastReceipt ? intval(substr($lastReceipt->receipt_number, -6)) + 1 : 1;
        
        return sprintf('REC-%s-%06d', $year, $sequence);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function items()
    {
        return $this->hasMany(ReceiptItem::class);
    }

    public function cancel(User $user, string $reason): bool
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => $user->id,
            'cancellation_reason' => $reason,
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'receipt.cancelled',
            'entity_type' => 'Receipt',
            'entity_id' => $this->id,
            'new_values' => ['reason' => $reason],
        ]);

        return true;
    }
}