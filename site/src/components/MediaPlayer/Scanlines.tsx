import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  opacity?: number;
}

function Scanlines({ opacity = 0.5, style = {}, ...props }: Props) {
  return <Elem style={{ ...style, opacity }} {...props} />;
}

const Elem = styled.div`
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    var(--w-primary-700) 0px 1px,
    transparent 1px 2px
  );
  opacity: 0.5;
`;

export default Scanlines;
