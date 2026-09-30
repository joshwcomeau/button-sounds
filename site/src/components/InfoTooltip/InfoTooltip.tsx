import * as React from 'react';
import styled from 'styled-components';
import { CircleQuestionMark } from 'lucide-react';
import type { Placement } from '@floating-ui/react';

import Tooltip from '@/components/Tooltip';

interface Props {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
}

function InfoTooltip({ content, children, placement }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Tooltip
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      content={content}
      placement={placement}
    >
      <Trigger>
        {children}
        <StyledInfo aria-hidden="true" size={14} strokeWidth={2.5} />
      </Trigger>
    </Tooltip>
  );
}

const Trigger = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-width: 0;
  cursor: help;
`;

const StyledInfo = styled(CircleQuestionMark)`
  flex-shrink: 0;
  color: var(--color-gray-900);
`;

export default InfoTooltip;
