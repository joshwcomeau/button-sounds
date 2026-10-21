import * as React from 'react';
import styled from 'styled-components';

function Footer() {
  return (
    <OuterWrapper>
      <Wrapper></Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  position: relative;
  background: var(--color-gray-600);
  border-radius: 4px;
  corner-shape: bevel;
  padding: 3px;
`;

const Wrapper = styled.div`
  background: var(--color-gray-50);
  border-radius: 16px;
  corner-shape: bevel;
  padding: 1rem;
`;

export default Footer;
