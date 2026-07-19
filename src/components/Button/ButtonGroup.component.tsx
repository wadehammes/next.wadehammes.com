import classNames from "classnames";
import type { ReactNode } from "react";
import styles from "src/components/Button/Button.module.css";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export const ButtonGroup = ({ children, className }: ButtonGroupProps) => (
  <div className={classNames(styles.group, className)}>{children}</div>
);

export default ButtonGroup;
