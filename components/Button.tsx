import { HTMLProps, MouseEvent } from "react";

type Props = HTMLProps<HTMLButtonElement> & {
  callback: Function;
};
export const Button = ({
  callback,
  children,
  onClick,
  type,
  ...rest
}: Props) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    callback();
  };
  return (
    <button onClick={handleClick} {...rest}>
      {children}
    </button>
  );
};
