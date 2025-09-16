import { Dispatch, SetStateAction } from "react";

export const handleAmountChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: Dispatch<SetStateAction<string>>
) => {
  const val = e.target.value;
  if (/^\d*(\.\d{0,2})?$/.test(val)) {
    setValue(val);
  }
};

export const handleAmountKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
};
