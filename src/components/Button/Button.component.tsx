import classNames from "classnames";
import {
  type ButtonProps,
  ButtonVariants,
} from "src/components/Button/Button.interfaces";
import styles from "src/components/Button/Button.module.css";

export const Button = ({
  children,
  handleClick,
  variant = ButtonVariants.Primary,
  className,
  label,
  hasTooltip,
  ariaLabel,
}: ButtonProps) => (
  <button
    type="button"
    tabIndex={0}
    className={classNames(
      styles.button,
      {
        [styles.primary]: variant === ButtonVariants.Primary,
        [styles.hasTooltip]: hasTooltip,
        [styles.iconButton]: !label && children,
      },
      className,
    )}
    onClick={handleClick}
    aria-label={ariaLabel ?? label}
  >
    {children ?? label ?? ""}
  </button>
);

export default Button;
