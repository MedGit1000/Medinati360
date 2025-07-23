<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * This is the most critical part of the fix. It tells Laravel which
     * fields from the form are safe to save to the database.
     */
    protected $fillable = [
        'title',
        'description',
        'latitude',
        'longitude',
        'category_id',
        'user_id',       // <-- Crucial for associating the incident
        'status',
        'photo_path',    // <-- Crucial for saving the photo link
        'is_approved',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'is_approved' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    // Relationships (no changes needed here, but good to have)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
    public const STATUS_PENDING   = 'Pending';
    public const STATUS_APPROVED  = 'Approved';
    public const STATUS_REJECTED  = 'Rejected';
    public const STATUS_IN_WORK   = 'In progress';
    public const STATUS_RESOLVED  = 'Resolved';
}
