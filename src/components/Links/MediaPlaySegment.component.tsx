import styles from "src/components/Links/LinkCard.module.css";
import PlayIcon from "src/styles/icons/play.svg";
import StopIcon from "src/styles/icons/stop.svg";

export const MediaPlaySegment = () => (
  <span className={styles.mediaPlaySegment}>
    <span aria-hidden className={styles.mediaPlayIconWrap}>
      <PlayIcon className={styles.mediaPlayIconPlay} />
      <StopIcon className={styles.mediaPlayIconStop} />
    </span>
    <span className="sr-only">
      <span className={styles.badgePlay}>Play</span>
      <span className={styles.badgeHide}>Stop</span>
    </span>
  </span>
);

export default MediaPlaySegment;
