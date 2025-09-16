"use client";

export function TextInput({
  placeholder,
  onChange,
  label,
  type,
}: {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
  type: string;
}) {
  return (
    <div className="pt-2">
      <label className="block mb-2 text-md font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
        placeholder={placeholder}
      />
    </div>
  );
}
