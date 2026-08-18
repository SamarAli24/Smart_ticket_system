import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className = "", id, children, ...rest }, ref) => {
    const select = (
      <select
        ref={ref}
        id={id}
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${className}`}
        {...rest}
      >
        {children}
      </select>
    );

    if (!label) return select;

    return (
      <label className="block" htmlFor={id}>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
        {select}
      </label>
    );
  }
);

Select.displayName = "Select";

export default Select;
