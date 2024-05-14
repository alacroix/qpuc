import type { ButtonHTMLAttributes } from "react";
import c from "clsx";

function Button({
  children,
  className,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={c(
        "h-11 cursor-pointer rounded-lg border-b-[4px]  px-6 py-2 font-semibold text-white transition-all",
        {
          "border-amber-600 bg-amber-500 hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] active:brightness-90":
            !disabled,
          "cursor-not-allowed border-gray-500 bg-gray-400": disabled,
        },
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
