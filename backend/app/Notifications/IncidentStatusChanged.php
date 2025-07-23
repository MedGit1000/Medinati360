<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class IncidentStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Incident $incident,
        public string   $newStatus   // 'Pending' | 'Approved' | 'Rejected'
    ) {}

    /** channels this notification will be stored / sent on */
    public function via($notifiable): array
    {
        return ['database'];    // later you can add 'broadcast', 'mail', etc.
    }

    /** payload saved into the `notifications` table */
    public function toDatabase($notifiable): array
    {
        return [
            'incident_id'     => $this->incident->id,
            'title'           => $this->incident->title,
            'status'          => $this->newStatus,
            'rejection_reason' => $this->incident->rejection_reason,
        ];
    }
}
