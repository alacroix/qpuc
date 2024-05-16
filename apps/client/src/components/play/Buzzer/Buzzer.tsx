import clsx from "clsx";
import useSound from "use-sound";
import { useEffect, useState } from "react";

type Props = {
  buzzerState: BuzzerState;
  disabled?: boolean;
  onClick?: () => void;
};

export enum BuzzerState {
  Idle = 1,
  Active,
  Wrong,
  Good,
}

export default function Buzzer({
  buzzerState,
  disabled = false,
  onClick,
}: Props) {
  const [timeoutPointer, setTimeoutPointer] = useState<number | null>(null);

  const [playPressed] = useSound("/sfx/pressed.mp3", {
    interrupt: true,
    volume: 0.2,
  });
  const [playReleased] = useSound("/sfx/released.mp3", {
    interrupt: true,
    volume: 0.3,
  });
  const [playBuzzer] = useSound("/sfx/buzzer.mp3");
  const [playWrongAnswer] = useSound("/sfx/wrong_answer.mp3");
  const [playCorrectAnswer] = useSound("/sfx/correct_answer.mp3");

  useEffect(() => {
    if (buzzerState === BuzzerState.Active) {
      playBuzzer();
    } else if (buzzerState === BuzzerState.Wrong) {
      playWrongAnswer();
    } else if (buzzerState === BuzzerState.Good) {
      playCorrectAnswer();
    }
  }, [buzzerState]);

  const handlePointerDown = () => {
    const id = setTimeout(() => {
      playPressed();
      if (!disabled && onClick) onClick();
    }, 50);
    setTimeoutPointer(id);
  };

  const handlePointerUp = () => {
    if (timeoutPointer !== null) {
      clearTimeout(timeoutPointer);
      setTimeoutPointer(null);
      playReleased();
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-200">
      <div
        className={clsx(
          "bg-gradient-radial shadow-buzzer active:shadow-buzzer-pressed aspect-square w-[90%] rounded-full border-8 border-gray-300 transition-all duration-75 active:w-[88%]",
          {
            "from-indigo-100 to-indigo-300": buzzerState === BuzzerState.Idle,
            "from-yellow-100 to-yellow-300": buzzerState === BuzzerState.Active,
            "from-red-100 to-red-300": buzzerState === BuzzerState.Wrong,
            "from-green-100 to-green-300": buzzerState === BuzzerState.Good,
          },
        )}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
}
