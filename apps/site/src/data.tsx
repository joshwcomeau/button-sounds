import React from 'react';
import type { SoundName } from 'button-sounds';

const haloHref =
  'https://nuphy.com/products/halo75-v2-qmk-via-wireless-custom-mechanical-keyboard';
const uhkHref = 'https://uhk.io/product/uhk60v2';
const raddyHref = 'https://iraddy.com/products/rf320';
const raddySharedDesc = (
  <p>
    I recently got a shortwave radio (<a href={raddyHref}>Raddy RF320</a>),
    hoping to find obscure radio content. Turns out there’s not much out there,
    but at least the buttons sound kinda cool!
  </p>
);

interface SoundData {
  title: string;
  description: React.ReactNode;
}

export const SOUND_DATA: Record<SoundName, SoundData> = {
  'halo-kbd-soft': {
    title: 'NuPhy Halo75 V2 (gentle)',
    description: (
      <p>
        Gentle keypresses using my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'halo-kbd-hard': {
    title: 'NuPhy Halo75 V2 (vigorous)',
    description: (
      <p>
        Vigorous activations of my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'halo-kbd-space': {
    title: 'NuPhy Halo75 V2 (space)',
    description: (
      <p>
        Hitting the spacebar on my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'halo-kbd-shift': {
    title: 'NuPhy Halo75 V2 (shift)',
    description: (
      <p>
        Pressing the shift key on my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'uhk-soft': {
    title: 'UHK60 (gentle)',
    description: (
      <p>
        Gently pressing keys on my{' '}
        <a href={uhkHref}>Ultimate Hacking Keyboard 60 v2</a> mechanical
        keyboard with “Silent Pink” switches.
      </p>
    ),
  },
  'low-thumps': {
    title: 'Rubber Buttons',
    description: (
      <p>
        Pressing soft rubber buttons on the remote control for my standing desk.
      </p>
    ),
  },
  'ps4-clicky': {
    title: 'PS4 (clicky)',
    description: (
      <p>
        Pressing the clicky “Mute” button on a Playstation DualSense controller.
      </p>
    ),
  },
  'ps4-double': {
    title: 'PS4 (double)',
    description: (
      <p>
        Tapping the back trigger buttons (L2/R2) on a Playstation DualSense
        controller from a distance to create a stepped double click.
      </p>
    ),
  },
  'ps4-dull': {
    title: 'PS4 (dull)',
    description: (
      <p>
        Pressing the main 4 action buttons on a Playstation DualSense
        controller.
      </p>
    ),
  },
  'ps4-paddle': {
    title: 'PS4 (paddle)',
    description: (
      <p>
        The back trigger buttons (L2/R2) on a Playstation DualSense controller
        are spring-loaded. For this sound, I pressed the triggers gently and
        then quickly released them, allowing them to snap back to their normal
        position.
      </p>
    ),
  },
  'ps4-snappy': {
    title: 'PS4 (snappy)',
    description: (
      <p>
        Pressing the emblematic “PS” button in the center of my Playstation
        DualSense controller.
      </p>
    ),
  },
  'raddy-low': {
    title: 'Raddy (low)',
    description: (
      <>
        {raddySharedDesc}
        <p>This is the lowest-pitched button on the device.</p>
      </>
    ),
  },
  'raddy-medium': {
    title: 'Raddy (medium)',
    description: (
      <>
        {raddySharedDesc}
        <p>
          Most of the buttons on the device have a medium pitch, like this
          recording.
        </p>
      </>
    ),
  },
  'raddy-high': {
    title: 'Raddy (high)',
    description: (
      <>
        {raddySharedDesc}
        <p>This is the highest and most clickiest button on the device.</p>
      </>
    ),
  },
  'synth-on': {
    title: 'Synthesized button, on',
    description: (
      <p>
        Using granular and FM synthesis, I created a button sound in Ableton
        Live. The “release” sound goes up in pitch, making this sound suitable
        for turning a toggle on.
      </p>
    ),
  },
  'synth-off': {
    title: 'Synthesized button, off',
    description: (
      <p>
        Using granular and FM synthesis, I created a button sound in Ableton
        Live. The “release” sound goes down in pitch, making this sound suitable
        for toggling something off.
      </p>
    ),
  },
};
