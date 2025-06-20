import classNames from "classnames";
import { Children, type ReactNode } from "react";
import styles from "src/components/Animate/Animate.module.css";

interface AnimateProps {
  visible?: boolean;
  timing?: number;
  children?: ReactNode;
}

export const Animate = ({
  children,
  visible = false,
  timing = 100,
}: AnimateProps) =>
  children
    ? Children.map(children, (child: ReactNode, i: number) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={classNames(styles.animateWrapper, {
            [styles.visible]: visible,
          })}
          style={{ transitionDelay: `${timing * i}ms` }}
        >
          {child}
        </div>
      ))
    : null;
