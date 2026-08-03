import { createHash } from "node:crypto";

const GRAVATAR_BASE_URL = "https://www.gravatar.com/avatar";

export const getGravatarHash = (email: string): string =>
  createHash("md5").update(email.trim().toLowerCase()).digest("hex");

export const buildGravatarUrl = (email: string, size = 208): string => {
  const gravatarUrl = new URL(`${GRAVATAR_BASE_URL}/${getGravatarHash(email)}`);
  gravatarUrl.searchParams.set("s", String(size));
  gravatarUrl.searchParams.set("d", "404");
  return gravatarUrl.href;
};
