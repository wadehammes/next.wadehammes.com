import React, { FC, ReactChild } from "react";
import styled, { css } from "styled-components";

interface AnimateWrapperProps {
  wait: number;
  visible: boolean;
}

const AnimateWrapper = styled.div<AnimateWrapperProps>`
  opacity: 0;
  transform: translateY(0.5em);
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
  transition-delay: ${({ wait }) => `${wait}ms`};

  ${({ visible }) =>
    visible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `};
`;

interface AnimateProps {
  children?: ReactChild | ReactChild[];
  visible?: boolean;
}

export const Animate: FC<AnimateProps> = ({ children, visible = false }) => {
  return React.Children.map(children, (child, i: number) => (
    <AnimateWrapper wait={100 * i} visible={visible}>
      {child}
    </AnimateWrapper>
  ));
};
