import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  trailing?: ReactNode;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, trailing, label, className = "", id, ...rest }, ref) => {
    const input = (
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-slate-200 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${
            icon ? "pl-9" : "pl-3"
          } ${trailing ? "pr-9" : "pr-3"} ${className}`}
          {...rest}
        />
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>
    );

    if (!label) return input;

    return (
      <label className="block" htmlFor={id}>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
        {input}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
