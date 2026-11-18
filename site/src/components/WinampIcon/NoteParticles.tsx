import { EighthNote, HalfNote } from 'lucide-react';
import styled from 'styled-components';

function NoteParticles() {
  return (
    <Wrapper>
      <HalfNote />
      <EighthNote />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
`;

export default NoteParticles;
