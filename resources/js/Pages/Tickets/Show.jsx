import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PriorityBadge, StatusBadge } from '@/Components/Badge';

export default function Show({ ticket }) {
    const destroy = () => {
        if (window.confirm('Are you sure you want to delete this ticket? This cannot be undone.')) {
            router.delete(route('tickets.destroy', ticket.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h1 className="text-xl font-semibold text-gray-800">Ticket #{ticket.id}</h1>}>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
                <h2 className="break-words text-2xl font-bold text-gray-900">{ticket.title}</h2>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <PriorityBadge value={ticket.priority} />
                    <StatusBadge value={ticket.status} />
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {ticket.category}
                    </span>
                </div>

                <p className="mt-6 whitespace-pre-wrap break-words text-gray-700">{ticket.description}</p>

                <dl className="mt-6 grid grid-cols-1 gap-2 border-t pt-4 text-sm text-gray-500 sm:grid-cols-2">
                    <div>Created: {new Date(ticket.created_at).toLocaleString()}</div>
                    <div>Updated: {new Date(ticket.updated_at).toLocaleString()}</div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={route('tickets.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Back
                    </Link>
                    <Link href={route('tickets.edit', ticket.id)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                        Edit
                    </Link>
                    <button type="button" onClick={destroy} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
