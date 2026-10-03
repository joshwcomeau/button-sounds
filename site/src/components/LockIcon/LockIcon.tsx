import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number;
  isLocked?: boolean;
}

const HINGE_INSET = 8;
const ARC_START = 7;
const LOCK_TOP = 12;
const HINGE_CLOSED = `
  M ${HINGE_INSET},${LOCK_TOP}
  L ${HINGE_INSET},${ARC_START}
  A 3,3 0 0,1 ${24 - HINGE_INSET},${ARC_START}
  L ${24 - HINGE_INSET},${LOCK_TOP}
`;
const HINGE_OPEN = `
  M ${HINGE_INSET},${LOCK_TOP}
  L ${HINGE_INSET},${ARC_START}
  A 3,3 0 0,1 ${24 - HINGE_INSET},${ARC_START}
  L ${24 - HINGE_INSET},${LOCK_TOP - 5}
`;

function LockIcon({ size = 16, isLocked = false, ...props }: Props) {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <rect x="3" y={LOCK_TOP} width="18" height="12" fill="none" rx="3" />
      <Hinge
        d={isLocked ? HINGE_CLOSED : HINGE_OPEN}
        data-is-locked={isLocked}
      />
    </Svg>
  );
}

const Svg = styled.svg`
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  overflow: visible;

  rect {
    vector-effect: non-scaling-stroke;
  }
`;

const Hinge = styled.path`
  transition:
    transform 200ms,
    d 200ms 100ms;
  transform-origin: ${HINGE_INSET}px ${LOCK_TOP}px;
  vector-effect: non-scaling-stroke;

  &[data-is-locked='false'] {
    transition:
      transform 150ms,
      d 0ms;

    transform: rotateY(120deg);
  }
`;

export default LockIcon;
