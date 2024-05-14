import { InputHTMLAttributes } from "react";
import c from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

function Input({ className, label, id, name, type = "text", ...rest }: Props) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium leading-6 text-gray-200"
        >
          Votre pseudo :
        </label>
      )}

      <div className="mt-2">
        <input
          type={type}
          name={name}
          id={id || name}
          className={c(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6",
            className,
          )}
          {...rest}
        />
      </div>
      <p className="mt-2 text-sm text-gray-400" id="email-description">
        Pour pouvoir commencer à jouer.
      </p>
    </div>
  );
}

export default Input;
