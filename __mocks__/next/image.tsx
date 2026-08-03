import type { ImageProps } from "next/image";

const Image = ({ src, alt, ...props }: ImageProps) => (
  <img alt={alt ?? ""} src={typeof src === "string" ? src : ""} {...props} />
);

export default Image;
