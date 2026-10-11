import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                active
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileLink({ href, active, children, ...props }) {
    return (
        <Link
            href={href}
            {...props}
            className={`block w-full border-l-4 py-2 pe-4 ps-3 text-start text-base font-medium ${
                active
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
        >
            {children}
        </Link>
    );
}

function FlashMessages() {
    const { flash } = usePage().props;
    const [show, setShow] = useState(true);

    useEffect(() => {
        setShow(true);
        if (!flash?.success && !flash?.error) return;
        const timer = setTimeout(() => setShow(false), 4000);
        return () => clearTimeout(timer);
    }, [flash]);

    const message = flash?.success || flash?.error;
    if (!show || !message) return null;

    const isError = !flash.success && flash.error;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
            <div
                role="alert"
                className={`flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                    isError
                        ? 'border-red-300 bg-red-50 text-red-800'
                        : 'border-green-300 bg-green-50 text-green-800'
                }`}
            >
                <span>{message}</span>
                <button type="button" onClick={() => setShow(false)} aria-label="Dismiss" className="ms-4 text-lg leading-none">
                    ×
                </button>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="text-lg font-bold text-indigo-600">
                                HelpDesk
                            </Link>
                            <div className="hidden h-full gap-6 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('tickets.index')} active={route().current('tickets.*')}>
                                    Tickets
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden items-center gap-4 sm:flex">
                            <Link
                                href={route('tickets.create')}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                + New Ticket
                            </Link>
                            <span className="text-sm font-medium text-gray-700">{user.name}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-500 hover:text-gray-800"
                            >
                                Logout
                            </Link>
                        </div>

                        <div className="flex items-center sm:hidden">
                            <button
                                type="button"
                                onClick={() => setOpen(!open)}
                                aria-label="Toggle menu"
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    {open ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {open && (
                    <div className="border-t border-gray-200 pb-3 pt-2 sm:hidden">
                        <MobileLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</MobileLink>
                        <MobileLink href={route('tickets.index')} active={route().current('tickets.index')}>Tickets</MobileLink>
                        <MobileLink href={route('tickets.create')} active={route().current('tickets.create')}>+ New Ticket</MobileLink>
                        <div className="mt-2 border-t border-gray-200 px-4 pt-3 text-sm font-medium text-gray-700">{user.name}</div>
                        <MobileLink href={route('logout')} method="post" as="button">Logout</MobileLink>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <FlashMessages />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
}
