import React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';
import type { SoundName } from 'button-sounds';

import { range } from '@/utils';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import { useSoundSettings } from '@/components/SoundSettingsProvider';

interface Props extends React.ComponentProps<'button'> {
  name: SoundName;
  isSelected: boolean;
  triggerPress: () => void;
  triggerRelease: () => void;
  setSelectedSoundName: (name: SoundName) => void;
}

function SoundSelectBtn({
  name,
  isSelected,
  triggerPress,
  triggerRelease,
  setSelectedSoundName,
  ...delegated
}: Props) {
  const wrapperRef = React.useRef<HTMLButtonElement>(null);

  const { usingLofi } = useSoundSettings();
  useButtonSounds(wrapperRef, 'carson-microflip', {
    lofi: usingLofi,
    pitchVariation: 0.1,
    volume: 0.2,
  });

  return (
    <Wrapper
      ref={wrapperRef}
      data-is-selected={isSelected}
      data-button-id={name}
      onClick={() => setSelectedSoundName(name)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        if (event.repeat) {
          return;
        }

        triggerPress();
      }}
      onKeyUp={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        triggerRelease();
      }}
      {...delegated}
    >
      <BevelEdge side="top" color="var(--top-edge)" radius={5} />
      <BevelEdge side="bottom" color="var(--bottom-edge)" radius={5} />

      <ActiveIndicator>
        {range(10).map((index) => (
          <Cell key={index} style={{ '--delay': `${index * 12}ms` }} />
        ))}
      </ActiveIndicator>
      <Name>{name}</Name>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  --top-edge: var(--color-gray-500);
  --bottom-edge: transparent;
  --from-color: var(--color-gray-75);
  --to-color: var(--color-gray-75);
  --focus-offset: 0.5px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 2rem;
  padding-right: 0.75rem;
  background:
    linear-gradient(to right, var(--from-color), var(--to-color)),
    var(--color-background);
  border: 1px solid var(--color-gray-100);
  border-radius: 4px;
  corner-shape: bevel;
  cursor: pointer;

  @property --from-color {
    syntax: '<color>';
    inherits: false;
    /* NOTE: this property needs to be a plain color value, I can't use a CSS variable. This is equivalent to --color-gray-75. We also overwrite this above, so I don't actually think this initial value is ever used: */
    initial-value: hsl(210deg 17% 15%);
  }

  &[data-is-selected='true'],
  &:active {
    --top-edge: transparent;
    --bottom-edge: var(--color-gray-500);
    --from-color: var(--color-background);
    --to-color: var(--color-background);
  }

  @supports (color: color-mix(in oklab, red, green)) {
    &[data-is-selected='true'] {
      /* --top-edge: hsl(from var(--color-background) h s l / 0.4); */
      --bottom-edge: color-mix(
        in oklab,
        var(--color-gray-100),
        hsl(50deg 100% 50%) 50%
      );
      border: 1px solid
        color-mix(in oklab, var(--color-gray-100), hsl(50deg 100% 50%) 30%);
    }
  }

  &[data-is-selected='true'] {
    --from-color: hsl(50deg 100% 50% / 0.15);
    transition: --from-color 400ms;
    font-weight: 600;
  }
`;

const Name = styled.span`
  display: block;
  font-size: 0.875rem;
  color: var(--color-gray-900);

  ${Wrapper}[data-is-selected='true'] &, ${Wrapper}:active & {
    color: white;
    transform: translateY(1px);
  }
`;

const ActiveIndicator = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 6px;
  height: fit-content;
  border-radius: 2px 0 0 2px;
  corner-shape: bevel;
  /* Trim corners */
  overflow: hidden;

  ${Wrapper}[data-is-selected='true'] & {
    --shadow: hsl(45deg 100% 50% / 0.5);
    --shadow-dampener: hsl(210deg 15% 6% / 0.5);
    background: hsl(45deg 100% 50% / 0.5);
    box-shadow:
      -1px 0px 2px 0px var(--shadow-dampener),
      1px 0px 2px 0px var(--shadow-dampener),
      0px 0px 4px 0px var(--shadow),
      0px 0px 4px 0px var(--shadow),
      0px 0px 8px 0px var(--shadow),
      0px 0px 16px 0px var(--shadow);
  }
`;
const Cell = styled.span`
  --delay: 0ms;
  height: 1px;
  background: var(--color-gray-200);
  border-radius: 1px;
  corner-shape: bevel;
  /* HACK: I was seeing a weird inconsistent flicker, where the cells were flashing yellow for a frame when they finish fading out. Adding a 2ms delay fixes it for some reason. */
  transition: background 400ms 2ms;

  ${Wrapper}[data-is-selected='true'] & {
    background: hsl(45deg 100% 60%);
    transition: background 200ms var(--delay);
  }
`;

export default SoundSelectBtn;
