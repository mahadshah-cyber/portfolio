"use client";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichEditor({ value, onChange, placeholder = "Write your content here..." }: RichEditorProps) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={20}
        className="w-full px-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all font-mono text-sm leading-relaxed resize-vertical"
      />
      <p className="text-xs text-zinc-700 mt-2">
        Supports HTML markup. Use &lt;h2&gt;, &lt;p&gt;, &lt;code&gt;, &lt;strong&gt;, &lt;em&gt; tags.
      </p>
    </div>
  );
}
