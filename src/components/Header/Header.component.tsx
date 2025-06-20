import classNames from "classnames";
import Link from "next/link";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import styles from "src/components/Header/Header.module.css";
import { Themes, usePreferredTheme } from "src/hooks/usePreferredTheme";
import Crown from "src/styles/icons/crown.svg";
import Moon from "src/styles/icons/moon.svg";
import Sun from "src/styles/icons/sun.svg";

interface HeaderProps {
  isPlaygroundOpen?: boolean;
}

export const Header = ({ isPlaygroundOpen = false }: HeaderProps) => {
  const { currentTheme, updateTheme } = usePreferredTheme();

  return (
    <header className={classNames("container", styles.headerContainer)}>
      <div className={styles.logo}>
        <Link href="/">
          <span className="crownWrapper">
            <Crown />
          </span>
        </Link>
      </div>
      <div
        className={classNames(
          styles.themeToggle,
          isPlaygroundOpen && styles.hideOnDesktop,
        )}
      >
        <Button
          variant={ButtonVariants.Text}
          ariaLabel={currentTheme === Themes.Light ? "Dark mode" : "Light mode"}
          className={classNames("theme", styles.themeButton)}
          handleClick={() =>
            updateTheme(
              currentTheme === Themes.Light ? Themes.Dark : Themes.Light,
            )
          }
        >
          <div className={styles.iconWrapper}>
            {currentTheme === Themes.Light ? <Moon /> : <Sun />}
          </div>
        </Button>
      </div>
    </header>
  );
};

export default Header;
