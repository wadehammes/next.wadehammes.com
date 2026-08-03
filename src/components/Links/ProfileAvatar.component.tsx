"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "src/components/Links/ProfileAvatar.module.css";
import type { ParsedImage } from "src/prismic/parseImage";

const DEFAULT_AVATAR_SIZE = 104;

export interface ProfileAvatarProps {
  fallbackAvatarUrl?: string | null;
  image?: ParsedImage | null;
  name: string;
}

export const ProfileAvatar = ({
  fallbackAvatarUrl,
  image,
  name,
}: ProfileAvatarProps) => {
  const fallbackFailedRef = useRef(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  if (image) {
    return (
      <Image
        alt={name}
        className={styles.avatar}
        height={image.height ?? DEFAULT_AVATAR_SIZE}
        src={image.url}
        unoptimized
        width={image.width ?? DEFAULT_AVATAR_SIZE}
      />
    );
  }

  if (fallbackAvatarUrl && !fallbackFailed) {
    return (
      <Image
        alt={name}
        className={styles.avatar}
        height={DEFAULT_AVATAR_SIZE}
        onError={(event) => {
          if (fallbackFailedRef.current) {
            return;
          }

          fallbackFailedRef.current = true;
          event.currentTarget.removeAttribute("src");
          setFallbackFailed(true);
        }}
        src={fallbackAvatarUrl}
        unoptimized
        width={DEFAULT_AVATAR_SIZE}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={styles.placeholder}
      data-testid="rhProfileAvatarPlaceholder"
    />
  );
};

export default ProfileAvatar;
