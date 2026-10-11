import React from 'react';
import styled from 'styled-components';

import useBoopMinimal from '@/hooks/use-boop-minimal';

interface Props extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  isHovering: boolean;
  accentColor: string;
  timing?: number;
  style?: React.CSSProperties;
}

const ExternalIcon = ({
  size = 16,
  isHovering,
  accentColor,
  timing = 150,
  style = {},
  ...delegated
}: Props) => {
  const id = React.useId();

  const isBooped = useBoopMinimal(isHovering, { timing });

  const maskId = `external-icon-mask-${id}`;

  const arrowPath = isBooped
    ? `M 10 14 L 21 3 h -6 h 6 v 6`
    : `M 10 14 L 20 4 h -6 h 6 v 6`;

  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      style={{
        width: size,
        height: size,
        opacity: isHovering ? 1 : 0.7,
        ...style,
      }}
      {...delegated}
    >
      <mask id={maskId}>
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <rect x="10" y="0" width="16" height="14" fill="black" />
      </mask>
      <rect
        x={3}
        y={6}
        width={15}
        height={15}
        rx={2}
        mask={`url(#${maskId})`}
      />
      <Arrow d={arrowPath} stroke={isHovering ? accentColor : 'currentColor'} />
    </Svg>
  );
};

const Svg = styled.svg`
  stroke: currentColor;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  will-change: transform;
  backface-visibility: hidden;
  transition: opacity 200ms;
`;

const Arrow = styled.path`
  transition: stroke var(--spring-springy) var(--spring-springy-duration);
`;

export default ExternalIcon;
