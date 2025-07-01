<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'photo_path',
        'status',
        'latitude',
        'longitude',
        'user_id',
        'category_id',
    ];

    /**
     * Get the user that owns the incident.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the incident belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
