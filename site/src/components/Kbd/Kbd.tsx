import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge/BevelEdge';

interface Props extends React.ComponentProps<'kbd'> {
  // This prop was originally named “key”, and I spent a baffling 5 minutes trying to figure out why the prop wasn't making it through 😂.
  // (The `key` attribute in React is used for element identity, it's a reserved keyword that can't be used as a normal prop)
  char: string;
  // When listening for ArrowUp/ArrowDown, I also want to support WASD-style keyboard shortcuts. Aliases will trigger the 'isDepressed' state when pressed.
  aliases?: Array<string>;
}

function Kbd({ char, aliases, children, ...delegated }: Props) {
  const [isDepressed, setIsDepressed] = React.useState(false);

  const handleKeyDown = React.useEffectEvent((event: KeyboardEvent) => {
    if (event.key === char || aliases?.includes(event.key)) {
      setIsDepressed(true);
    }
  });

  const handleKeyUp = React.useEffectEvent((event: KeyboardEvent) => {
    if (event.key === char || aliases?.includes(event.key)) {
      setIsDepressed(false);
    }
  });

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Wrapper {...delegated}>
      <Face data-is-depressed={isDepressed}>
        {children}
        <BevelEdge side="bottom" color="var(--bottom-edge)" radius={3} />
      </Face>
    </Wrapper>
  );
}

const Wrapper = styled.kbd`
  position: relative;
  display: inline-block;
  background: var(--color-gray-200);
  border-radius: 3px;
  corner-shape: bevel;
  transform: translateY(2px);
`;

const Face = styled.span`
  --bottom-edge: var(--color-gray-500);
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: system-ui;
  font-weight: 600;
  padding-inline: 8px;
  /* 1px border necessary for BevelEdge to position correctly: */
  border: 1px solid transparent;
  border-radius: inherit;
  corner-shape: bevel;
  background: var(--color-gray-250);
  transform: translateY(-3px);

  &[data-is-depressed='true'] {
    transform: translateY(-1px);
  }
`;

export default Kbd;
