import * as React from 'react';
import styled from 'styled-components';

import NoteParticles from './NoteParticles';

function WinampIcon(props) {
  const id = React.useId().replace(/:/g, '');
  const maskId = `stroke-mask-${id}`;
  return (
    <Wrapper>
      <NoteParticles />
      <Diamond />
      <Svg fill="none" viewBox="0 0 32 32">
        <path
          fill="#C80"
          d="M27.544 3.217 8.125 14.427a.25.25 0 0 0-.125.217v3.606c0 .138.112.25.25.25h1.646a.25.25 0 0 1 .177.427l-6.5 6.5a.25.25 0 0 0-.073.177v4.932c0 .2.221.318.388.209l20-13.17a.25.25 0 0 0 .112-.21V13.7a.25.25 0 0 0-.193-.244l-1.868-.434a.25.25 0 0 1-.12-.42l6.027-6.028a.25.25 0 0 0 .073-.177V3.433a.25.25 0 0 0-.375-.216"
        ></path>
        <path
          fill="#FFD558"
          d="M14.5 14.5H8L28 3l-9.5 9 5.5 1.5-20.5 12z"
        ></path>
        <mask
          id={maskId}
          width="27"
          height="30"
          x="2.5"
          y="2"
          fill="#000"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M2.5 2h27v30h-27z"></path>
          <path d="M27.544 3.217 8.125 14.427a.25.25 0 0 0-.125.217v3.606c0 .138.112.25.25.25h1.646a.25.25 0 0 1 .177.427l-6.5 6.5a.25.25 0 0 0-.073.177v4.932c0 .2.221.318.388.209l20-13.17a.25.25 0 0 0 .112-.21V13.7a.25.25 0 0 0-.193-.244l-1.868-.434a.25.25 0 0 1-.12-.42l6.027-6.028a.25.25 0 0 0 .073-.177V3.433a.25.25 0 0 0-.375-.216"></path>
        </mask>
        <path
          stroke="#000"
          strokeWidth="2"
          d="M8.125 14.428 27.544 3.217a.25.25 0 0 1 .375.216v2.963a.25.25 0 0 1-.073.177l-6.028 6.028a.25.25 0 0 0 .12.42l1.869.434a.25.25 0 0 1 .193.244v3.666a.25.25 0 0 1-.113.21l-20 13.17a.25.25 0 0 1-.387-.209v-4.932a.25.25 0 0 1 .073-.177l6.5-6.5a.25.25 0 0 0-.177-.427H8.25a.25.25 0 0 1-.25-.25v-3.606a.25.25 0 0 1 .125-.216Z"
          mask={`url(#${maskId})`}
        ></path>
      </Svg>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Diamond = styled.div`
  position: absolute;
  inset: 0;
  width: 12px;
  height: 12px;
  margin: auto;
  transform: rotate(45deg);
  transform-origin: center;
  background: var(--color-gray-800);
`;

const Svg = styled.svg`
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
`;

export default WinampIcon;
