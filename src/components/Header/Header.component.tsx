import classNames from "classnames";
import Link from "next/link";
import styles from "src/components/Header/Header.module.css";
import Crown from "src/styles/icons/crown.svg";

export const Header = () => {
  return (
    <header className={classNames("container", styles.headerContainer)}>
      <div className={styles.logo}>
        <Link href="/">
          <span className="crownWrapper">
            <Crown />
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
