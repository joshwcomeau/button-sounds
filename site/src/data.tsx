import React from 'react';
import type { SoundName } from 'button-sounds';

const haloHref =
  'https://nuphy.com/products/halo75-v2-qmk-via-wireless-custom-mechanical-keyboard';
const uhkHref = 'https://uhk.io/product/uhk60v2';
const raddyHref = 'https://iraddy.com/products/rf320';
const hi75Href = 'https://leobogtech.com/products/epomaker-leobog-hi75';
const urevoHref = 'https://www.urevo.com/';
const steamDeckHref = 'https://store.steampowered.com/steamdeck';
const revstarHref =
  'https://ca.yamaha.com/en/musical-instruments/guitars-basses-amps/products/electric-guitars/rs-2022/';
const godinHref = 'https://godinguitars.com/product/concert-cw-clasica-ii/';

const raddySharedDesc = (
  <p>
    I recently got a shortwave radio (<a href={raddyHref}>Raddy RF320</a>),
    hoping to find obscure radio content. Turns out there’s not much out there
    these days. 😅
  </p>
);

const urevoSharedDesc = (
  <p>
    If you haven’t tried using a walking pad with a standing desk, I highly
    recommend it! The walking pad I use is from <a href={urevoHref}>Urevo</a>,
    but they don't seem to offer the one I have anymore, but the one I got has
    been solid.
  </p>
);

type Category = 'mouse' | 'keyboard' | 'gamepad' | 'toggle' | 'misc';

interface SoundData {
  title: string;
  category: Category;
  description: React.ReactNode;
}

export const SOUND_DATA: Record<SoundName, SoundData> = {
  'hi75-soft': {
    title: 'EPOMAKER x LEOBOG Hi75 (gentle)',
    category: 'keyboard',
    description: (
      <>
        <p>
          If you fall deep enough into the mechanical keyboard rabbit hole,
          you’ll start to hear terms like “creamy” and “thocky”. This keyboard
          from <a href={hi75Href}>Leobog</a> with custom “Reaper” switches is
          supposedly one of the thockiest.
        </p>
      </>
    ),
  },
  'hi75-medium': {
    title: 'EPOMAKER x LEOBOG Hi75 (medium)',
    category: 'keyboard',
    description: (
      <>
        <p>
          Slightly harder keypresses on my aforementioned{' '}
          <a href={hi75Href}>Hi75</a> mechanical keyboard with Reaoer switches.
        </p>
      </>
    ),
  },
  'hi75-hard': {
    title: 'EPOMAKER x LEOBOG Hi75 (hard)',
    category: 'keyboard',
    description: (
      <>
        <p>
          Downright savage keypresses on my{' '}
          <a href={hi75Href}>Hi75 mechanical keyboard</a>.
        </p>
      </>
    ),
  },
  'hi75-space': {
    title: 'EPOMAKER x LEOBOG Hi75 (space)',
    category: 'keyboard',
    description: (
      <>
        <p>
          Tapping the spacebar on my{' '}
          <a href={hi75Href}>Hi75 mechanical keyboard</a>, which has a distinct
          sound compared to the other keys.
        </p>
      </>
    ),
  },
  'hi75-knob': {
    title: 'EPOMAKER x LEOBOG Hi75 (knob)',
    category: 'keyboard',
    description: (
      <>
        <p>
          The <a href={hi75Href}>Hi75</a> keyboard has a chunky volume knob in
          the top-right corner which can be pressed in to mute/unmute.
        </p>
      </>
    ),
  },

  'halo-soft': {
    title: 'NuPhy Halo75 V2 (gentle)',
    category: 'keyboard',
    description: (
      <p>
        Gentle keypresses using my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'halo-hard': {
    title: 'NuPhy Halo75 V2 (vigorous)',
    category: 'keyboard',
    description: (
      <p>
        Really smacking the keys on my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'halo-space': {
    title: 'NuPhy Halo75 V2 (space)',
    category: 'keyboard',
    description: (
      <p>
        Hitting the spacebar on my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'halo-shift': {
    title: 'NuPhy Halo75 V2 (shift)',
    category: 'keyboard',
    description: (
      <p>
        Pressing the shift key on my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard with Raspberry (46gf) switches.
      </p>
    ),
  },
  'uhk-soft': {
    title: 'UHK60 (gentle)',
    category: 'keyboard',
    description: (
      <p>
        Gently pressing keys on my{' '}
        <a href={uhkHref}>Ultimate Hacking Keyboard 60 v2</a> mechanical
        keyboard with “Silent Pink” switches.
      </p>
    ),
  },
  'uhk-medium': {
    title: 'UHK60 (medium)',
    category: 'keyboard',
    description: (
      <p>
        Pressing the keys on my{' '}
        <a href={uhkHref}>Ultimate Hacking Keyboard 60 v2</a> with a moderate
        amount of force. Mechanical keyboard with “Silent Pink” switches.
      </p>
    ),
  },
  'uhk-space': {
    title: 'UHK60 (space)',
    category: 'keyboard',
    description: (
      <p>
        Really smacking the keys on my{' '}
        <a href={uhkHref}>Ultimate Hacking Keyboard 60 v2</a> mechanical
        keyboard. “Silent Pink” switches.
      </p>
    ),
  },
  'low-thumps': {
    title: 'Rubber Buttons',
    category: 'misc',
    description: (
      <p>
        Pressing soft rubber buttons on the remote control for my standing desk.
      </p>
    ),
  },
  'ps4-clicky': {
    title: 'PS4 (clicky)',
    category: 'gamepad',
    description: (
      <p>
        Pressing the clicky “Mute” button on a Playstation DualSense controller.
      </p>
    ),
  },
  'ps4-double': {
    title: 'PS4 (double)',
    category: 'gamepad',
    description: (
      <p>
        Tapping the back trigger buttons (L2/R2) on a Playstation DualSense
        controller from a distance to create a stepped double click.
      </p>
    ),
  },
  'ps4-dull': {
    title: 'PS4 (dull)',
    category: 'gamepad',
    description: (
      <p>
        Pressing the main 4 action buttons on a Playstation DualSense
        controller.
      </p>
    ),
  },
  'ps4-paddle': {
    title: 'PS4 (paddle)',
    category: 'gamepad',
    description: (
      <p>
        The back trigger buttons (L2/R2) on a Playstation DualSense controller
        are spring-loaded, and when they’re released quickly, they snap back
        into place.
      </p>
    ),
  },
  'ps4-snappy': {
    title: 'PS4 (snappy)',
    category: 'gamepad',
    description: (
      <p>
        Pressing the emblematic “PS” button in the center of my Playstation
        DualSense controller.
      </p>
    ),
  },
  'raddy-low': {
    title: 'Raddy (low)',
    category: 'misc',
    description: (
      <>
        {raddySharedDesc}
        <p>This is the lowest-pitched button on the device.</p>
      </>
    ),
  },
  'raddy-medium': {
    title: 'Raddy (medium)',
    category: 'misc',
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
    category: 'misc',
    description: (
      <>
        {raddySharedDesc}
        <p>This is the highest and most clickiest button on the device.</p>
      </>
    ),
  },
  'carson-microflip': {
    title: 'Carson MicroFlip',
    category: 'misc',
    description: (
      <p>
        My partner was kind enough to let me borrow his{' '}
        <a href="https://www.carson.com/product/mp-250-en">Carson MicroFlip</a>{' '}
        microscope, which has a surprisingly satisfying on/off button.
      </p>
    ),
  },
  'heated-blanket': {
    title: 'Heated Blanket',
    category: 'misc',
    description: (
      <p>
        Tactile buttons on a heated blanket remote control. Honestly not the
        most interesting sound in the world, but sometimes you just need a basic
        button sound!
      </p>
    ),
  },
  'asus-kbd-soft': {
    title: 'ASUS Keyboard (soft)',
    category: 'keyboard',
    description: (
      <>
        <p>
          In contrast to the other mechanical keyboards in this set, I also
          recorded the buttons on a cheap rubber-dome ASUS keyboard, the kind
          that comes included with budget desktop PCs.
        </p>
      </>
    ),
  },
  'asus-kbd-medium': {
    title: 'ASUS Keyboard (soft)',
    category: 'keyboard',
    description: (
      <p>Slightly harder keypresses on a cheap rubber-dome ASUS keyboard.</p>
    ),
  },
  'asus-kbd-hard': {
    title: 'ASUS Keyboard (soft)',
    category: 'keyboard',
    description: (
      <p>
        I threw caution to the wind and beat the hell out of my cheap
        rubber-dome ASUS keyboard. I am happy to report that the keyboard
        survived the ordeal.
      </p>
    ),
  },
  'asus-kbd-space': {
    title: 'ASUS Keyboard (soft)',
    category: 'keyboard',
    description: (
      <p>Pressing the spacebar on a cheap rubber-dome ASUS keyboard.</p>
    ),
  },
  'asus-mouse': {
    title: 'ASUS Mouse',
    category: 'mouse',
    description: (
      <p>
        This recording captures the sound of the left click on a very cheap ASUS
        mouse, the kind that comes included with budget desktop PCs.
      </p>
    ),
  },
  'rival-3': {
    title: 'Steelseries Rival 3 (left click)',
    category: 'mouse',
    description: (
      <p>
        The left click sound from the{' '}
        <a href="https://steelseries.com/en-ca/gaming-mice/rival-3-gen-2">
          Steelseries Rival 3
        </a>
        , a budget gaming mouse.
      </p>
    ),
  },
  'rival-3-middle': {
    title: 'Steelseries Rival 3',
    category: 'mouse',
    description: (
      <p>
        The{' '}
        <a href="https://steelseries.com/en-ca/gaming-mice/rival-3-gen-2">
          Steelseries Rival 3
        </a>{' '}
        gaming mouse has a clickable scroll wheel, and I thought it was
        interesting enough to capture.
      </p>
    ),
  },
  'ergo-mx': {
    title: 'Logitech MX Ergo trackball mouse',
    category: 'mouse',
    description: (
      <p>
        A cult favourite, the{' '}
        <a href="https://www.logitech.com/en-ca/shop/p/mx-ergo-wireless-trackball-mouse">
          Logitech MX Ergo mouse
        </a>{' '}
        remains stationary while you roll a large ball with your thumb to move
        the cursor. It’s a big chunky boy with a big chunky click!
      </p>
    ),
  },
  'mx-master-3': {
    title: 'Logitech MX Ergo trackball mouse',
    category: 'mouse',
    description: (
      <p>
        The{' '}
        <a href="https://www.logitech.com/en-ca/shop/p/mx-master-3s.910-007500">
          Logitech MX Master 3
        </a>{' '}
        has been my daily driver for years. This recording captures the sound of
        its left click.
      </p>
    ),
  },
  'kvm-switch': {
    title: 'KVM Switch',
    category: 'toggle',
    description: (
      <p>
        A KVM switch is a device that allows multiple PCs to share the same USB
        peripherals like mouse/keyboard. I got a cheap one on Amazon years ago.
        This recording captures the sound of toggling between PCs.
      </p>
    ),
  },
  'led-blacklight': {
    title: 'LED Blacklight',
    category: 'toggle',
    description: (
      <p>
        My partner has a handheld LED blacklight, used to check the fluorescence
        of gemstones. It has a satisfyingly deep on/off switch, captured in this
        recording.
      </p>
    ),
  },
  'treadmill-sharp': {
    title: 'Treadmill Remote (sharp)',
    category: 'misc',
    description: (
      <p>
        My <a href={urevoHref}>Urevo</a> walking pad came with a basic remote
        control with several buttons. They all have a slightly different
        character, so I recorded all three!
      </p>
    ),
  },
  'treadmill-pitched': {
    title: 'Treadmill Remote (pitched)',
    category: 'misc',
    description: (
      <p>
        My <a href={urevoHref}>Urevo</a> walking pad came with a basic remote
        control with several buttons. They all have a slightly different
        character, so I recorded all three!
      </p>
    ),
  },
  'treadmill-flinty': {
    title: 'Treadmill Remote (flinty)',
    category: 'misc',
    description: (
      <p>
        My <a href={urevoHref}>Urevo</a> walking pad came with a basic remote
        control with several buttons. They all have a slightly different
        character, so I recorded all three!
      </p>
    ),
  },
  'camera-latch': {
    title: 'Camera Latch',
    category: 'misc',
    description: (
      <>
        <p>
          My partner has an ancient camera with a latch that pops open the film
          compartment. It’s not really a button persay, but it sounded too cool
          not to include. 😄
        </p>
      </>
    ),
  },

  'sd-standard': {
    title: 'Steam Deck (Standard)',
    category: 'gamepad',
    description: (
      <>
        <p>
          The main A/B/X/Y buttons on the <a href={steamDeckHref}>Steam Deck</a>
          , a handheld gaming PC. Soft and clicky.
        </p>
      </>
    ),
  },
  'sd-squelchy': {
    title: 'Steam Deck (Squelchy)',
    category: 'gamepad',
    description: (
      <>
        <p>
          Pressing the four directional buttons on my{' '}
          <a href={steamDeckHref}>Steam Deck</a>, a handheld gaming PC.
          Interestingly, each direction has a slightly different sound, so
          there's quite a lot of variety in this recording.
        </p>
      </>
    ),
  },
  'sd-resonant': {
    title: 'Steam Deck (Resonant)',
    category: 'gamepad',
    description: (
      <>
        <p>
          Tapping and gently releasing the back trigger buttons (L2/R2) on the{' '}
          <a href={steamDeckHref}>Steam Deck</a>, a handheld gaming PC. The snap
          back produces a pitched, resonant sound.
        </p>
      </>
    ),
  },
  'sd-distorted': {
    title: 'Steam Deck (Distorted)',
    category: 'gamepad',
    description: (
      <>
        <p>
          Smacking and flicking the back trigger buttons (L2/R2) on the{' '}
          <a href={steamDeckHref}>Steam Deck</a>, a handheld gaming PC. This
          wound up being quite an aggressive sound, which could be useful for
          industrial/mechanical designs.
        </p>
      </>
    ),
  },
  'sd-metallic': {
    title: 'Steam Deck (Metallic)',
    category: 'gamepad',
    description: (
      <>
        <p>
          Tapping the shoulder buttons (L1/R1) on the{' '}
          <a href={steamDeckHref}>Steam Deck</a>, a handheld gaming PC. For some
          reason, this sounds metallic and tinkly, like tapping the side of a
          kettle.
        </p>
      </>
    ),
  },
  'sd-clicky': {
    title: 'Steam Deck (Clicky)',
    category: 'gamepad',
    description: (
      <>
        <p>
          The analog joysticks on the <a href={steamDeckHref}>Steam Deck</a> can
          be pushed in, creating a sharp clicky sound.
        </p>
      </>
    ),
  },
  iidx: {
    title: 'Beatmania IIDX buttons',
    category: 'gamepad',
    description: (
      <p>
        I play a Japanese rhythm game known as Beatmania IIDX, which uses a{' '}
        <a href="https://www.gamo2.com/en/index.php?dispatch=products.view&product_id=386">
          custom DJ controller
        </a>{' '}
        with spring-loaded buttons. They're pretty twangy and unique.
      </p>
    ),
  },
  'popper-dice': {
    title: 'Dice Popper',
    category: 'misc',
    description: (
      <p>
        The board game Trouble® uses a plastic-domed dice popper to generate
        random numbers, by depressing a metal diaphragm that snaps back to roll
        a die. It's a pretty unique sound!
      </p>
    ),
  },
  'popper-empty': {
    title: 'Dice Popper (empty)',
    category: 'misc',
    description: (
      <p>
        Like the previous sound, this recording captures a plastic-domed dice
        popper, but this time without the die inside! This version doesn't
        include the rattling tail from the rolling die.
      </p>
    ),
  },
  'guitar-toggle-on': {
    title: 'Guitar Toggle (on)',
    category: 'toggle',
    description: (
      <p>
        My <a href={revstarHref}>Yamaha Revstar</a> electric guitar has a toggle
        to switch between pickups. Switching to the bridge pickup produces a
        bright clap-like sound, which can work for something being toggled on.
      </p>
    ),
  },
  'guitar-toggle-off': {
    title: 'Guitar Toggle (off)',
    category: 'toggle',
    description: (
      <p>
        My <a href={revstarHref}>Yamaha Revstar</a> electric guitar has a toggle
        to switch between pickups. Switching to the neck pickup produces a
        duller knock-type sound, which can work for something being toggled off.
      </p>
    ),
  },
  'tonal-on': {
    title: 'Tonal (on)',
    category: 'toggle',
    description: (
      <p>
        By plucking a muted nylon string on my{' '}
        <a href={godinHref}>Godin Concert</a> guitar, I created a soft tonal
        sound that could work for certain UI interactions. The “release” sound
        goes up in pitch, confirming that something is activated.
      </p>
    ),
  },
  'tonal-off': {
    title: 'Tonal (off)',
    category: 'toggle',
    description: (
      <p>
        By plucking a muted nylon string on my{' '}
        <a href={godinHref}>Godin Concert</a> guitar, I created a soft tonal
        sound that could work for certain UI interactions. The “release” sound
        goes down in pitch, indicating that something is deactivated.
      </p>
    ),
  },

  'synth-on': {
    title: 'Synthesized button, on',
    category: 'toggle',
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
    category: 'toggle',
    description: (
      <p>
        Using granular and FM synthesis, I created a button sound in Ableton
        Live. The “release” sound goes down in pitch, making this sound suitable
        for toggling something off.
      </p>
    ),
  },
};
