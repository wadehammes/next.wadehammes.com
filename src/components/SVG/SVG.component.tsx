import classNames from "classnames";
import styles from "src/components/SVG/SVG.module.css";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  visible: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const SVG = ({ visible, className, children, ...props }: SVGProps) => (
  <svg
    className={classNames(
      styles.svg,
      {
        [styles.visible]: visible,
      },
      className,
    )}
    {...props}
  >
    {children}
  </svg>
);

export default SVG;
