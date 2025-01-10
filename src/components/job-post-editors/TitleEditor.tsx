'use client';

interface TitleEditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export default function TitleEditor({ value, onSave, onCancel }: TitleEditorProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTitle = formData.get('title') as string;
    if (newTitle.trim()) {
      onSave(newTitle.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={value}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-custom-green focus:outline-none focus:ring-1 focus:ring-custom-green sm:text-sm"
          placeholder="Enter job title"
          maxLength={100}
          required
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-custom-green rounded-md hover:bg-custom-green/90"
        >
          Save
        </button>
      </div>
    </form>
  );
}
