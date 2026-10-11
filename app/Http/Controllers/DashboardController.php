<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $tickets = $request->user()->tickets();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total'       => (clone $tickets)->count(),
                'open'        => (clone $tickets)->where('status', 'Open')->count(),
                'in_progress' => (clone $tickets)->where('status', 'In Progress')->count(),
                'resolved'    => (clone $tickets)->where('status', 'Resolved')->count(),
                'closed'      => (clone $tickets)->where('status', 'Closed')->count(),
            ],
            'recent' => (clone $tickets)->latest()->take(5)->get(),
        ]);
    }
}
