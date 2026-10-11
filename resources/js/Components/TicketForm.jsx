import { Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

const fieldClass =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

function Select({ id, label, value, onChange, items, error }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <select id={id} value={value} onChange={onChange} className={fieldClass}>
                {items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export default function TicketForm({ ticket = null, options }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: ticket?.title ?? '',
        description: ticket?.description ?? '',
        priority: ticket?.priority ?? 'Medium',
        status: ticket?.status ?? 'Open',
        category: ticket?.category ?? options.categories[0],
    });

    const submit = (e) => {
        e.preventDefault();
        if (ticket) {
            put(route('tickets.update', ticket.id));
        } else {
            post(route('tickets.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6 rounded-lg bg-white p-6 shadow">
            {Object.keys(errors).length > 0 && (
                <div role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                    Please fix the errors below and try again.
                </div>
            )}

            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    rows={5}
                    className={fieldClass}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Select id="priority" label="Priority" value={data.priority}
                    onChange={(e) => setData('priority', e.target.value)} items={options.priorities} error={errors.priority} />
                <Select id="status" label="Status" value={data.status}
                    onChange={(e) => setData('status', e.target.value)} items={options.statuses} error={errors.status} />
                <Select id="category" label="Category" value={data.category}
                    onChange={(e) => setData('category', e.target.value)} items={options.categories} error={errors.category} />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {processing ? 'Saving...' : ticket ? 'Update Ticket' : 'Create Ticket'}
                </PrimaryButton>
                <Link href={route('tickets.index')} className="text-sm text-gray-600 hover:text-gray-900">
                    Cancel
                </Link>
            </div>
        </form>
    );
}
