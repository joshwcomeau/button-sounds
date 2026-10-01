import * as React from 'react';
import styled from 'styled-components';

import Slider from '@/components/Slider';

interface Props extends React.ComponentProps<typeof Slider> {
  label: React.ReactNode;
}

function LabeledSlider({
  label,
  value,
  step,
  className,
  style,
  id,
  ...delegated
}: Props) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <Wrapper className={className} style={style}>
      <Header>
        <Label htmlFor={inputId}>{label}</Label>
        <Value aria-hidden="true">{formatValue(value, step)}</Value>
      </Header>
      <Slider {...delegated} id={inputId} value={value} step={step} />
    </Wrapper>
  );
}

function formatValue(value: number, step: number) {
  const decimals = decimalPlaces(step);
  return String(Number(value.toFixed(decimals)));
}

function decimalPlaces(step: number) {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  color: var(--color-gray-900);
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 0;
  font-size: 0.875rem;
`;

const Value = styled.span`
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-size: 0.875rem;
`;

export default LabeledSlider;
