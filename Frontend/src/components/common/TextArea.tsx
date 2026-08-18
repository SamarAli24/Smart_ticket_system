import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className = "", id, ...rest }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        id={id}
        className={`w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${className}`}
        {...rest}
      />
    );

    if (!label) return textarea;

    return (
      <label className="block" htmlFor={id}>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
        {textarea}
      </label>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
