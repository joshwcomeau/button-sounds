import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number;
  isPressing?: boolean;
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

function LockIcon({
  size = 16,
  isPressing = false,
  isLocked = false,
  ...props
}: Props) {
  const id = React.useId();
  const maskId = `mask-${id.replace(/:/g, '-')}`;
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }} {...props}>
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect x="0" y="0" width="24" height="24" fill="white" stroke="none" />
          <rect
            x="3"
            y={LOCK_TOP}
            width="18"
            height="12"
            fill="black"
            stroke="none"
            rx="3"
          />
        </mask>
      </defs>
      <rect x="3" y={LOCK_TOP} width="18" height="12" fill="none" rx="3" />
      <g mask={`url(#${maskId})`}>
        <Hinge
          d={isLocked ? HINGE_CLOSED : HINGE_OPEN}
          data-is-locked={isLocked}
          data-is-pressing={isPressing}
        />
      </g>
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
  transform-origin: ${HINGE_INSET}px ${LOCK_TOP}px;
  vector-effect: non-scaling-stroke;

  &[data-is-locked='false'] {
    transform: rotateY(120deg);
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      transform 200ms,
      d 200ms 100ms;
    &[data-is-locked='false'] {
      transition:
        transform 150ms,
        d 0ms;
    }
  }

  &[data-is-pressing='true'] {
    translate: 0 2px;
  }
`;

export default LockIcon;
