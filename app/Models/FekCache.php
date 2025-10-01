<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FekCache extends Model
{
    protected $table = 'fek_cache';

    protected $fillable = [
        'fek_number', 'fek_type', 'fek_date', 'title',
        'total_pages', 'color_pages', 'maps_count',
        'has_images', 'pdf_url', 'metadata', 'cached_at'
    ];

    protected $casts = [
        'fek_date' => 'date',
        'has_images' => 'boolean',
        'metadata' => 'array',
        'cached_at' => 'datetime',
    ];
}