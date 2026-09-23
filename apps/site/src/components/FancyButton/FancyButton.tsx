import * as React from 'react';
import styled from 'styled-components';

function FancyButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const previousStatusRef = React.useRef<string>('idle');
  const [currentStatus, setCurrentStatus] = React.useState('idle');

  const hasFreshlyEntered =
    currentStatus === 'hover' && previousStatusRef.current === 'idle';

  return (
    <OuterWrapper type="button" {...props}>
      <Wrapper
        data-status={currentStatus}
        style={{
          '--transition-duration':
            currentStatus === 'idle' || hasFreshlyEntered
              ? '300ms'
              : currentStatus === 'active'
                ? '0ms'
                : '75ms',
        }}
        onMouseEnter={() => {
          previousStatusRef.current = currentStatus;
          setCurrentStatus('hover');
        }}
        onMouseLeave={() => {
          previousStatusRef.current = currentStatus;
          setCurrentStatus('idle');
        }}
        onMouseDown={() => {
          previousStatusRef.current = currentStatus;
          setCurrentStatus('active');
        }}
        onMouseUp={() => {
          previousStatusRef.current = currentStatus;
          setCurrentStatus('hover');
        }}
      >
        <Shaft />
        <CastShadow />
        <Clipper>
          <Front />
          <Face>
            Press me! <BottomShadow />
          </Face>
        </Clipper>
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.button`
  display: block;
  border: none;
  background: transparent;
  margin: 0;
  padding: 0;
  outline: 2px dotted var(--color-gray-200);
  corner-shape: bevel;
  border-radius: 16px;
  outline-offset: 2px;
`;

const Wrapper = styled.span`
  --outer-radius: 16px;
  --gap: 2px;
  --bw: 2px;
  position: relative;
  display: block;
  width: 15rem;
  height: 6rem;
  border: none;
  border-bottom: var(--bw) solid var(--color-gray-300);
  /*
    Ok so this mess of a declaration is because we have a 2px bottom border and no other borders. This means that in the bottom-left and bottom-right corners, the border fades away in a triangular fashion, which changes the perceived angle of the corner.
    We can fix this by using the long-form of border-radius, so that the disappearing border is parallel with the button face's beveled edges.
  */
  /* prettier-ignore */
  border-radius:
    var(--outer-radius) var(--outer-radius)
    var(--outer-radius) var(--outer-radius)
    / var(--outer-radius) var(--outer-radius)
    calc(var(--outer-radius) + var(--bw))
    calc(var(--outer-radius) + var(--bw));
  corner-shape: inherit;
  background: var(--color-background);
`;

const Front = styled.span`
  --dark: hsl(360deg 100% 30%);
  --light: hsl(353deg 100% 40%);
  position: absolute;
  left: var(--gap);
  right: var(--gap);
  bottom: 0;
  height: 50%;
  background:
    linear-gradient(to top, hsl(0deg 0% 0% / 0.2), transparent 4px),
    linear-gradient(
      to right,
      var(--dark) 0px var(--outer-radius),
      var(--light) var(--outer-radius) calc(100% - var(--outer-radius)),
      var(--dark) calc(100% - var(--outer-radius)) 100%
    );
`;
const Shaft = styled.span`
  --inset: 1px;
  --dark: var(--color-gray-75);
  --light: var(--color-gray-100);
  position: absolute;
  top: var(--inset);
  left: var(--inset);
  right: var(--inset);
  height: 50%;
  border-radius: inherit;
  corner-shape: inherit;
  background:
    linear-gradient(to top, hsl(0deg 0% 0% / 0.2), transparent 4px),
    linear-gradient(
      to right,
      var(--dark) 0px var(--outer-radius),
      var(--light) var(--outer-radius) calc(100% - var(--outer-radius)),
      var(--dark) calc(100% - var(--outer-radius)) 100%
    );
`;

const CastShadow = styled.span`
  --size: 8px;
  position: absolute;
  display: block;
  bottom: 0;
  left: var(--gap);
  right: var(--gap);
  height: 50%;
  background: hsl(350deg 50% 10%);
  border-radius: 0 0 var(--outer-radius) var(--outer-radius);
  corner-shape: inherit;
  opacity: 0.5;
  transition: transform var(--transition-duration);
  transform: translateY(var(--size));
  pointer-events: none;

  ${Wrapper}[data-status="hover"] & {
    --size: 16px;
  }
  ${Wrapper}[data-status="active"] &, ${Wrapper}:active & {
    --size: 0px;
  }
`;

const Clipper = styled.span`
  position: absolute;
  inset: 0;
  top: -16px;
  padding-top: 16px;
  overflow: hidden;
  border-radius: 0 0 var(--outer-radius) var(--outer-radius);
  corner-shape: inherit;
`;

const Face = styled.span`
  --shadow: hsl(350deg 100% 10% / 0.25);
  position: relative;
  margin: var(--gap);
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 2 * var(--gap));
  height: calc(100% - 2 * var(--gap));
  background: linear-gradient(
    to bottom,
    hsl(350deg 100% 60%),
    hsl(350deg 100% 50%)
  );
  border-top: 2px solid hsl(340deg 100% 80%);
  border-radius: var(--outer-radius);
  corner-shape: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  text-shadow: 0px 1px 0px hsl(350deg 100% 10% / 0.25);
  overflow: hidden;
  transition: transform var(--transition-duration);

  ${Wrapper}[data-status="hover"] & {
    transform: translateY(-4px);
  }
  ${Wrapper}[data-status="active"] &, ${Wrapper}:active & {
    transform: translateY(8px);
    background: linear-gradient(
      to top,
      hsl(350deg 100% 47%),
      hsl(350deg 100% 30%)
    );
    border-top: none;
    color: hsl(350deg 100% 90%);
    text-shadow: 0px -1px 0px hsl(350deg 100% 30%);
    box-shadow:
      inset 0px 1px 2px var(--shadow),
      inset 0px 2px 4px var(--shadow),
      inset 0px 4px 8px var(--shadow),
      inset 0px 8px 16px var(--shadow);
  }
`;

const BottomShadow = styled.span`
  --shadow-width: 8px;
  --corner-radius: calc(var(--outer-radius) + var(--shadow-width));
  position: absolute;
  /* We'll be blurring this border, which means if it rests right against the bottom, the blur radius will cause the very edge to be less opaque. We need the shadow to straddle the edge of the clipper, like an SVG line sitting right on the path: */
  top: calc(var(--shadow-width) * -0.5);

  /* Another annoying problem is that the start/end of the line terminates at a 45-degree angle, so we need the border to stick out beyond the left/right edges of the container, otherwise they'd end in a triangular shape. */
  left: calc(var(--shadow-width) * -1);
  right: calc(var(--shadow-width) * -1);
  /* Height doesn't have to be 100%, but it needs to be tall enough for the border-radius to be respected, and this is easier than figuring out the minimum viable value: */
  height: calc(100% - var(--outer-radius) * 2);
  border: var(--shadow-width) solid var(--color-background);
  border-bottom: none;
  border-radius: var(--corner-radius) var(--corner-radius) 0 0;
  corner-shape: inherit;
  opacity: 0;
  filter: blur(12px);
  mix-blend-mode: multiply;
  transition: opacity var(--transition-duration);

  ${Wrapper}[data-status="active"] &, ${Wrapper}:active & {
    opacity: 1;
  }
`;

export default FancyButton;
