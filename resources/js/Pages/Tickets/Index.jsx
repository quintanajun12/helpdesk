import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PriorityBadge, StatusBadge } from '@/Components/Badge';
import Pagination from '@/Components/Pagination';

const fieldClass = 'rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

export default function Index({ tickets, filters, options }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [priority, setPriority] = useState(filters.priority ?? '');
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(route('tickets.index'), { search, status, priority }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status, priority]);

    const destroy = (id) => {
        if (window.confirm('Are you sure you want to delete this ticket? This cannot be undone.')) {
            router.delete(route('tickets.destroy', id), { preserveScroll: true });
        }
    };

    const hasFilters = search || status || priority;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">My Tickets</h1>
                    <Link href={route('tickets.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                        + New Ticket
                    </Link>
                </div>
            }
        >
            <Head title="Tickets" />

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input type="search" placeholder="Search title..." value={search}
                    onChange={(e) => setSearch(e.target.value)} className={fieldClass} />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
                    <option value="">All statuses</option>
                    {options.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className={fieldClass}>
                    <option value="">All priorities</option>
                    {options.priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {tickets.data.length === 0 ? (
                <div className="rounded-lg bg-white p-10 text-center shadow">
                    <p className="text-lg font-semibold text-gray-800">
                        {hasFilters ? 'No tickets match your filters.' : 'You have no tickets yet.'}
                    </p>
                    {!hasFilters && (
                        <>
                            <p className="mt-1 text-sm text-gray-500">Create your first ticket to get started.</p>
                            <Link href={route('tickets.create')} className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                                Create a ticket
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {tickets.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                                            <Link href={route('tickets.show', t.id)} className="hover:text-indigo-600">{t.title}</Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{t.category}</td>
                                        <td className="px-4 py-3"><PriorityBadge value={t.priority} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={t.status} /></td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td className="space-x-3 px-4 py-3 text-right">
                                            <Link href={route('tickets.show', t.id)} className="text-gray-600 hover:text-gray-900">View</Link>
                                            <Link href={route('tickets.edit', t.id)} className="text-indigo-600 hover:text-indigo-800">Edit</Link>
                                            <button type="button" onClick={() => destroy(t.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="space-y-3 md:hidden">
                        {tickets.data.map((t) => (
                            <div key={t.id} className="rounded-lg bg-white p-4 shadow">
                                <Link href={route('tickets.show', t.id)} className="block break-words font-semibold text-gray-900">
                                    {t.title}
                                </Link>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <PriorityBadge value={t.priority} />
                                    <StatusBadge value={t.status} />
                                    <span className="text-xs text-gray-500">{t.category}</span>
                                </div>
                                <div className="mt-3 flex gap-4 text-sm">
                                    <Link href={route('tickets.show', t.id)} className="text-gray-600">View</Link>
                                    <Link href={route('tickets.edit', t.id)} className="text-indigo-600">Edit</Link>
                                    <button type="button" onClick={() => destroy(t.id)} className="text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination links={tickets.links} />
                </>
            )}
        </AuthenticatedLayout>
    );
}
