import * as React from 'react';
import styled from 'styled-components';

import JoshWComeauLogo from '@/components/JoshWComeauLogo';
import Screw from '@/components/Screw/Screw';

function Footer() {
  return (
    <OuterWrapper>
      <TLScrew />
      <TRScrew />
      <BLScrew />
      <BRScrew />
      <Wrapper>
        <JoshWComeauLogo />
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  position: relative;
  background: var(--color-gray-600);
  border-radius: 4px;
  corner-shape: bevel;
  padding: 3px;
  margin-top: 5rem;
`;

const Wrapper = styled.div`
  background: var(--color-gray-50);
  border-radius: 16px;
  corner-shape: bevel;
  padding: 1rem;
  padding-bottom: 3rem;
`;

const StyledScrew = styled(Screw)`
  --inset: 4px;
  position: absolute;

  @supports not (corner-shape: bevel) {
    display: none;
  }
`;

const TLScrew = styled(StyledScrew)`
  top: var(--inset);
  left: var(--inset);
`;
const TRScrew = styled(StyledScrew)`
  top: var(--inset);
  right: var(--inset);
`;
const BLScrew = styled(StyledScrew)`
  bottom: var(--inset);
  left: var(--inset);
`;
const BRScrew = styled(StyledScrew)`
  bottom: var(--inset);
  right: var(--inset);
`;

export default Footer;
