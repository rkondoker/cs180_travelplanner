import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "w-full px-3 py-2 rounded bg-white text-black", ...props },
    ref,
  ) => <input ref={ref} className={className} {...props} />,
);

Input.displayName = "Input";

export { Input };
