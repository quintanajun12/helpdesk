<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    public const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
    public const STATUSES   = ['Open', 'In Progress', 'Resolved', 'Closed'];
    public const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account', 'Other'];

    // user_id is intentionally NOT fillable: it is always set from the authenticated user.
    protected $fillable = ['title', 'description', 'priority', 'status', 'category'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
