import * as React from 'react';
import styled from 'styled-components';

import { range } from '@/utils';

interface Props {
  label: string;
  numOfSamples: number;
  lastPlayedSampleIndex: number | undefined;
  selectedSampleIndex: number | undefined;
  onSelectSampleManually: (sampleIndex: number) => void;
}

function SampleSelector({
  label,
  numOfSamples,
  lastPlayedSampleIndex,
  selectedSampleIndex,
  onSelectSampleManually,
}: Props) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Samples>
        {range(numOfSamples).map((index) => {
          return (
            <Sample
              key={index}
              data-is-last-played={lastPlayedSampleIndex === index}
              data-is-selected={selectedSampleIndex === index}
              onClick={() => onSelectSampleManually(index)}
            >
              {index}
            </Sample>
          );
        })}
      </Samples>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-background);
  padding: 16px;
  corner-shape: bevel;
  border-radius: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
`;

const Samples = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
`;

const Sample = styled.button`
  width: 2rem;
  aspect-ratio: 1 / 1;
  border: 2px solid hsl(175deg 100% 55%);
  border-radius: 6px;
  corner-shape: bevel;

  &[data-is-selected='true'] {
    background-color: #000;
  }
`;

export default SampleSelector;
