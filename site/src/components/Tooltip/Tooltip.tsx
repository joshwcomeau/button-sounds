import * as React from 'react';
import styled from 'styled-components';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
  arrow,
  type Placement,
} from '@floating-ui/react';

const CARET_SIZE = 10;
const CARET_GAP = 2;
const ARROW_PADDING = 8;

interface Props {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
}

function Tooltip({
  isOpen,
  onOpenChange,
  content,
  children,
  placement = 'top',
}: Props) {
  const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(
    null,
  );
  const tooltipId = React.useId();

  const {
    refs,
    floatingStyles,
    middlewareData,
    placement: resolvedPlacement,
    isPositioned,
    context,
  } = useFloating({
    open: isOpen,
    onOpenChange,
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(Math.round(CARET_SIZE / 2) + CARET_GAP),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowElement, padding: ARROW_PADDING }),
    ],
  });

  const hover = useHover(context, {
    enabled: onOpenChange != null,
    handleClose: safePolygon(),
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const side = resolvedPlacement.split('-')[0] as
    'top' | 'bottom' | 'left' | 'right';
  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  return (
    <>
      <Anchor
        {...getReferenceProps({
          // Floating UI’s ref setters are declared as methods, but they don’t use `this`.
          // eslint-disable-next-line @typescript-eslint/unbound-method
          ref: refs.setReference,
          'aria-describedby': isOpen ? tooltipId : undefined,
        })}
      >
        {children}
      </Anchor>
      {isOpen && (
        <FloatingPortal>
          <Positioner
            {...getFloatingProps({
              // eslint-disable-next-line @typescript-eslint/unbound-method
              ref: refs.setFloating,
              id: tooltipId,
              role: 'tooltip',
              style: {
                ...floatingStyles,
                visibility: isPositioned ? 'visible' : 'hidden',
              },
            })}
          >
            <Motion data-side={side} data-is-ready={isPositioned}>
              <Bubble>
                <Content>{content}</Content>
              </Bubble>
              <Caret
                ref={setArrowElement}
                data-side={side}
                style={
                  side === 'top' || side === 'bottom'
                    ? { left: arrowX != null ? `${arrowX}px` : undefined }
                    : { top: arrowY != null ? `${arrowY}px` : undefined }
                }
              />
            </Motion>
          </Positioner>
        </FloatingPortal>
      )}
    </>
  );
}

const Anchor = styled.span`
  display: inline-flex;
  min-width: 0;
`;

const Positioner = styled.div`
  --tooltip-bg: var(--color-gray-100);
  --tooltip-border: var(--color-gray-300);

  max-width: 20rem;
`;

const Motion = styled.div`
  --enter-x: 0px;
  --enter-y: -20px;
  position: relative;

  &[data-side='bottom'] {
    --enter-y: 20px;
  }

  &[data-side='left'] {
    --enter-x: -20px;
    --enter-y: 0px;
  }

  &[data-side='right'] {
    --enter-x: 20px;
    --enter-y: 0px;
  }

  &[data-is-ready='true'] {
    animation: tooltipEnter 200ms ease-out both;
  }

  @keyframes tooltipEnter {
    from {
      opacity: 0;
      translate: var(--enter-x) var(--enter-y);
    }

    to {
      opacity: 1;
      translate: 0 0;
    }
  }
`;

const Bubble = styled.div`
  padding: 16px 18px;
  background: var(--tooltip-bg);
  border: 1px solid var(--tooltip-border);
  border-radius: 8px;
  corner-shape: bevel;
  color: var(--color-gray-900);
  font-family: var(--font-default);
  box-shadow: 0 8px 24px hsl(210deg 15% 0% / 0.45);
  font-size: 0.825rem;
  line-height: 1.5;
  text-align: center;

  user-select: text;
  cursor: text;

  p {
    margin: 0;
  }
`;

const Content = styled.div`
  [data-is-ready='true'] & {
    animation: fadeFromTransparent 200ms ease-out 150ms both;
  }
`;

const Caret = styled.div`
  position: absolute;
  width: ${CARET_SIZE}px;
  height: ${CARET_SIZE}px;
  background: var(--tooltip-bg);
  border: 1px solid var(--tooltip-border);
  transform: rotate(45deg);

  &[data-side='top'] {
    bottom: ${1 - CARET_SIZE / 2}px;
    border-top-color: transparent;
    border-left-color: transparent;
  }

  &[data-side='bottom'] {
    top: ${1 - CARET_SIZE / 2}px;
    border-bottom-color: transparent;
    border-right-color: transparent;
  }

  &[data-side='left'] {
    right: ${1 - CARET_SIZE / 2}px;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }

  &[data-side='right'] {
    left: ${1 - CARET_SIZE / 2}px;
    border-top-color: transparent;
    border-right-color: transparent;
  }
`;

export default Tooltip;
