import React, { FC, ReactElement, ReactChild } from "react";
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
  children: ReactElement | ReactElement[];
  visible?: boolean;
  timing?: number;
}

export const Animate: FC<AnimateProps> = ({
  children,
  visible = false,
  timing = 150,
}) => (
  <>
    {React.Children.map<ReactChild, ReactElement>(
      children,
      (child: ReactElement, i: number) => (
        <AnimateWrapper
          // eslint-disable-next-line react/no-array-index-key
          key={`${child.type}-${i}`}
          wait={timing * i}
          visible={visible}
        >
          {child}
        </AnimateWrapper>
      ),
    )}
  </>
);
