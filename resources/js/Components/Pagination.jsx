import { Link } from '@inertiajs/react';

const clean = (label) =>
    label.replace('&laquo;', '«').replace('&raquo;', '»').replace(/<[^>]*>/g, '');

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="mt-6 flex flex-wrap justify-center gap-1" aria-label="Pagination">
            {links.map((link, i) => {
                const cls = `rounded-md border px-3 py-1.5 text-sm ${
                    link.active
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`;
                return link.url ? (
                    <Link key={i} href={link.url} preserveScroll className={cls}>
                        {clean(link.label)}
                    </Link>
                ) : (
                    <span key={i} className={`${cls} cursor-not-allowed opacity-50`}>
                        {clean(link.label)}
                    </span>
                );
            })}
        </nav>
    );
}
