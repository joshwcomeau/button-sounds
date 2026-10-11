/*
  Sometimes, in blog posts, I want to demo the TextLink component I use, but I don't want it to *actually* function as a link. This requires adding an `onClick` event handler to prevent the default behaviour, which can only be done in Client Components.

  This tiny component tackles that.
*/
'use client';

import * as React from 'react';

import TextLink from './TextLink';

function UnclickableLink(
  props: React.HTMLAttributes<HTMLAnchorElement>
) {
  return (
    <TextLink
      {...props}
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
    />
  );
}

export default UnclickableLink;
