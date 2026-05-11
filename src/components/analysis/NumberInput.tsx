interface NumberInputProps {
  value: { phone: string }
  onChange: (input: { phone: string }) => void
  onSubmit: () => void
}

export default function NumberInput({ value, onChange, onSubmit }: NumberInputProps) {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="w-full max-w-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          手机号码
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, '') })}
          className="border border-gray-300 rounded px-3 py-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g. 13812345678"
        />
      </div>
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={onSubmit}
          disabled={value.phone.trim() === ''}
          className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          分析
        </button>
      </div>
    </div>
  )
}
