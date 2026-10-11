import styled from 'styled-components';

import { Wrapper as AsideWrapper } from '@/components/Aside/Aside';

const InlineCode = styled.code`
  padding: 3px 8px;
  margin-inline: -4px;
  font-family: inherit;
  background: hsl(210deg 100% 5% / 0.2);
  border-radius: 4px;
  corner-shape: bevel;
  font-weight: 600;

  ${AsideWrapper} & {
    background: hsl(210deg 100% 75% / 0.1);
  }
`;

export default InlineCode;
