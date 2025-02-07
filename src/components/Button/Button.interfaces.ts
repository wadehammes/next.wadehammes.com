export enum ButtonVariants {
  Text = "Text",
  Primary = "Primary",
}

export interface ButtonElementProps {
  fixed?: boolean;
  variant?: ButtonVariants;
  hasTooltip?: boolean;
  ariaLabel?: string;
}

export interface ButtonProps extends ButtonElementProps {
  handleClick?: () => void;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}
