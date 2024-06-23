import type { ButtonHTMLAttributes } from "react";
import c from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  block?: boolean;
  variant?: "primary" | "success" | "danger";
};

function Button({
  block = false,
  children,
  className,
  disabled,
  variant = "primary",
  ...rest
}: Props) {
  return (
    <button
      className={c(
        "cursor-pointer rounded-lg border-b-[4px] px-6 py-2 font-semibold text-white transition-all",
        {
          " hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] active:brightness-90":
            !disabled,
          "border-amber-600 bg-amber-500": !disabled && variant === "primary",
          "border-green-600 bg-green-500": !disabled && variant === "success",
          "border-red-600 bg-red-500": !disabled && variant === "danger",
          "cursor-not-allowed border-gray-500 bg-gray-400": disabled,
          "h-11": !block,
          "h-full w-full": block,
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
