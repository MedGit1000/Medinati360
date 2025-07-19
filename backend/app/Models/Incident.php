<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'photo_path',
        'status',
        'is_approved',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'latitude',
        'longitude',
        'user_id',
        'category_id'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Get the user that owns the incident.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of the incident.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the admin who approved/rejected the incident.
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
