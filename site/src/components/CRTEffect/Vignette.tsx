import styled from 'styled-components';

import { normalize } from '@/utils';

interface Props {
  strength: number;
}

function Vignette({ strength }: Props) {
  return (
    <>
      <ColorGrade
        style={{
          '--saturate': normalize(strength, 0, 1, 1, 1.2),
          '--contrast': normalize(strength, 0, 1, 1, 1.1),
        }}
      />
      <Edges style={{ opacity: strength }} />
    </>
  );
}

const ColorGrade = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: saturate(var(--saturate)) contrast(var(--contrast));
  pointer-events: none;
`;

const Edges = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    hsl(210deg 25% 1% / 0.8) 100%
  );
  pointer-events: none;
`;

export default Vignette;
