export enum ButtonVariants {
  Text = "Text",
  Primary = "Primary",
}

export interface ButtonElementProps {
  fixed?: boolean;
  variant?: ButtonVariants;
}

export interface ButtonProps {
  handleClick?: () => void;
  variant?: ButtonVariants;
  className?: string;
  label?: string;
}
