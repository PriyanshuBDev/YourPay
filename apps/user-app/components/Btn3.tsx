interface ButtonProps {
  label: string;
  onClick: () => void;
  text: string;
  bg: string;
  hoverBg?: string;
  hoverText?: string;
  focus?: string;
}

export const Btn3 = ({
  label,
  onClick,
  text,
  bg,
  hoverBg,
  hoverText,
  focus,
}: ButtonProps) => {
  return (
    <button
      className={`cursor-pointer  ${hoverBg} ${hoverText} focus:outline-none focus:ring-4 ${focus} px-6 py-1.5 font-semibold rounded-lg text-lg ${text} ${bg}`}
      onClick={() => {
        onClick();
      }}
    >
      {label}
    </button>
  );
};
