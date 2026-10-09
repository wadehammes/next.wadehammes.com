declare module "react-dom" {
  export function browser(
    reason?: string | (() => string | Error),
  ): import("react").Usable<void>;
}
