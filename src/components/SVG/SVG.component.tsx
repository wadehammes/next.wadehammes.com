import classNames from "classnames";
import styles from "src/components/SVG/SVG.module.css";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  visible: boolean;
  className?: string;
  children?: React.ReactNode;
  fadeWithVisibility?: boolean;
}

export const SVG = ({
  visible,
  className,
  children,
  fadeWithVisibility = true,
  ...props
}: SVGProps) => (
  <svg
    className={classNames(
      styles.svg,
      {
        [styles.visible]: fadeWithVisibility ? visible : true,
      },
      className,
    )}
    {...props}
  >
    {children}
  </svg>
);

export default SVG;
