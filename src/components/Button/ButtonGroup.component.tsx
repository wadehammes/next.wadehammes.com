import type { ReactNode } from "react";
import styles from "src/components/Button/Button.module.css";

interface ButtonGroupProps {
  children: ReactNode;
}

export const ButtonGroup = ({ children }: ButtonGroupProps) => (
  <div className={styles.group}>{children}</div>
);

export default ButtonGroup;
