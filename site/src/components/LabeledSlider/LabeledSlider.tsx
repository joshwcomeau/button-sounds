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
  container-type: inline-size;
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

  /*
    In really narrow containers, the label splits across two lines in a very unsightly way. The cleanest approach is to hide the value, giving the label all of the available space.

    HACK: I only have one LabeledSlider, so I'm hardcoding the specific breakpoint that works for it. If I wind up using this elsewhere, I'll need to come up with a better solution.
  */
  @container (max-width: 11rem) {
    display: none;
  }
`;

export default LabeledSlider;
