import { HTMLProps, MouseEvent } from "react";
import { ClipLoader } from "react-spinners";

type Props = HTMLProps<HTMLButtonElement> & {
  loading?: boolean;
  bgColor?: string;
  textColor?: string;
  type?: "button" | "submit" | "reset" | undefined;
};
export const Button = ({
  children,
  onClick,
  loading,
  textColor,
  bgColor,
  className,
  disabled,
  ...rest
}: Props) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
  };
  const textColorStyle = `${textColor ? textColor : "text-white"}`;
  // const backgroundColorStyle = `${bgColor ? bgColor : "bg-primary-purple"
  const backgroundColorStyle = `bg-primary-purple`;
  const opacity = `${disabled ? "opacity-60" : ""}`;
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      {...rest}
      className={`relative flexCenter rounded-xl py-2 px-10 ${backgroundColorStyle} ${className} ${textColorStyle} ${opacity}`}
    >
      <ClipLoader loading={loading} className="absolute left-3" size={20} />

      <span>{children}</span>
    </button>
  );
};
