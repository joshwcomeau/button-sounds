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
`;

export default Footer;
