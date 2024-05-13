import type { ButtonHTMLAttributes } from "react";
import c from "clsx";

function Button({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={c("rounded bg-amber-500 p-2 font-bold", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
