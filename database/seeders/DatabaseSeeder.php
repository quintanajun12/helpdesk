<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    // Idempotent: safe to run on every deploy.
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@helpdesk.test'],
            ['name' => 'Demo User', 'password' => Hash::make('Password123!')]
        );

        if (! $user->wasRecentlyCreated) {
            return;
        }

        $samples = [
            ['Printer on 2nd floor is jammed', 'The shared printer keeps jamming on every print job since this morning.', 'High', 'Open', 'Hardware'],
            ['Cannot access VPN from home', 'VPN client shows authentication failed after the latest update.', 'Urgent', 'In Progress', 'Network'],
            ['Install Adobe Acrobat', 'Need Adobe Acrobat installed on the accounting workstation.', 'Low', 'Resolved', 'Software'],
            ['Reset my email password', 'I forgot my email password and need a reset link.', 'Medium', 'Closed', 'Account'],
        ];

        foreach ($samples as [$title, $description, $priority, $status, $category]) {
            $user->tickets()->create(compact('title', 'description', 'priority', 'status', 'category'));
        }
    }
}
