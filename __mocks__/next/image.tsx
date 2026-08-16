import type { ImageProps } from "next/image";

const Image = ({
  src,
  alt,
  blurDataURL: _blurDataURL,
  fill: _fill,
  loader: _loader,
  onLoadingComplete: _onLoadingComplete,
  overrideSrc: _overrideSrc,
  placeholder: _placeholder,
  priority: _priority,
  quality: _quality,
  unoptimized: _unoptimized,
  ...props
}: ImageProps) => (
  <img alt={alt ?? ""} src={typeof src === "string" ? src : ""} {...props} />
);

export default Image;
