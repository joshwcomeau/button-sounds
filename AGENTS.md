# Project context

This project contains an NPM package for playing UI sounds (/packages/button-sounds) as well as a landing page that showcases it (/apps/site).

# Workflow

**Check for my edits.** In addition to using coding agents, I also write a lot of code by hand. This means that files might change in-between prompts. **Always assume that any changes I make are intentional, and factor them into your plans.** Do not revert any unrecognized changes unless there's a very good reason to do so.

# Comments

Never hard-wrap comments to a fixed column width. Write each paragraph of a comment as a single continuous line, no matter how long — my editor soft-wraps, so long lines are fine. Only insert a line break to start a new thought, as though it was a new paragraph.

// ❌ BAD — hard-wrapped to a fixed width.
// This is an example of a longer comment that doesn't fit on one
// line, and so we've split it across multiple lines, adding a "//"
// to the start of each line.

// ✅ GOOD — one line per paragraph, however long.
// This is an example of a longer comment that doesn't fit on one line, but it is correctly being kept on one line, since the editor handles line-wrapping comments quite well.
// We only break onto a new line when moving onto another thought.

**This is very important.** I will get irritated if you keep formatting comments incorrectly.

# Styling conventions

The landing page uses styled-components, and I have some conventions for how I prefer to work with it.

Specifically, I do not use prop interpolation. For CSS that needs to be applied conditionally, I use data attributes:

```tsx
<Button data-is-selected={currentIndex === 5} />;

const Button = styled.button`
  background: transparent;

  &[data-is-selected='true'] {
    background: blue;
  }
`;
```

Instead of having an isSelected prop, I use a data attribute, and write a selector for it within my CSS.

I also rely quite heavily on CSS custom properties. So I’ll often do stuff like this:

```tsx
<Button style={{ '--from-color': fromColor, '--to-color': toColor }} />;

const Button = styled.button`
  background: linear-gradient(to bottom, var(--from-color), var(--to-color));
`;
```
