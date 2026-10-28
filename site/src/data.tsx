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

type Category = 'mouse' | 'keyboard' | 'gamepad' | 'toggle' | 'misc';

interface SoundData {
  title: string;
  category: Category;
  description: React.ReactNode;
}

// NOTE: The order here is a custom order based on what I think showcases the library best. It's not really consistent in any way.
export const SOUND_DATA: Record<SoundName, SoundData> = {
  'hi75-soft': {
    title: 'EPOMAKER x LEOBOG Hi75 (gentle)',
    category: 'keyboard',
    description: (
      <p>
        If you fall deep enough into the mechanical keyboard rabbit hole, you’ll
        start hearing terms like “creamy” and “thocky”. This keyboard from{' '}
        <a href={hi75Href}>Leobog</a> with custom “Reaper” switches is
        supposedly one of the thockiest.
      </p>
    ),
  },
  'hi75-space': {
    title: 'EPOMAKER x LEOBOG Hi75 (space)',
    category: 'keyboard',
    description: (
      <>
        <p>
          As you might expect, the <kbd>Space</kbd> key has a bit of a different
          timbre from the other keys, since it’s so much wider. This recording
          captures the spacebar on my <a href={hi75Href}>Hi75</a> mechanical
          keyboard.
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
  'led-blacklight': {
    title: 'LED Blacklight',
    category: 'misc',
    description: (
      <p>
        My partner has a handheld LED blacklight, used to check the fluorescence
        of gemstones. It has a satisfyingly deep on/off switch, captured in this
        recording.
      </p>
    ),
  },
  'popper-dice': {
    title: 'Dice Popper',
    category: 'misc',
    description: (
      <>
        <p>
          This is kind of a fun one. The board game <i>Trouble®</i> uses a
          plastic-domed dice popper to generate random numbers, by depressing a
          metal diaphragm that snaps back to roll a die.
        </p>
        <p>
          I imagine this being useful for any sort of randomize/shuffle UI
          interaction.
        </p>
      </>
    ),
  },
  'popper-empty': {
    title: 'Dice Popper (empty)',
    category: 'misc',
    description: (
      <p>
        Like the <code>popper-dice</code> sound, this recording captures a
        plastic-domed dice popper, but this time without the die inside! This
        version doesn't include the rattling tail from the rolling die.
      </p>
    ),
  },
  'ps4-dull': {
    title: 'PS4 (dull)',
    category: 'gamepad',
    description: (
      <p>
        There are a whole lot of buttons on a Playstation DualSense controller,
        and I recorded quite a few! This sound captures the main 4 action
        buttons (x, circle, square, and triangle)
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
        into place. This creates a neat sound where the <i>release</i> is louder
        than the <i>press</i>.
      </p>
    ),
  },
  'ps4-double': {
    title: 'PS4 (double)',
    category: 'gamepad',
    description: (
      <>
        <p>
          Instead of gently pressing and releasing the back trigger buttons
          (L2/R2) on a Playstation DualSense controller, I also tried tapping
          them aggressively, from a distance.
        </p>
        <p>
          This creates an interesting two-step sound where you can hear my
          finger hit the trigger, and then the trigger hit the controller.
        </p>
      </>
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
  'asus-mouse': {
    title: 'ASUS Mouse',
    category: 'mouse',
    description: (
      <>
        <p>
          So you know when you buy a budget pre-built desktop PC, they come
          bundled with the worst possible mouse/keyboard combo? This is one of
          those terrible included mice.
        </p>
        <p>
          The mouse <em>feels</em> pretty cheap, but it <em>sounds</em> decent
          enough!
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
        The <kbd>Shift</kbd> key on my <a href={haloHref}>NuPhy Halo75 V2</a>{' '}
        mechanical keyboard produces a sound somewhere between the normal keys
        and the spacebar. Honestly, this might be the perfect Goldilocks middle
        ground!
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
        amount of force.
      </p>
    ),
  },
  'uhk-space': {
    title: 'UHK60 (space)',
    category: 'keyboard',
    description: (
      <p>
        Hitting the <kbd>Space</kbd> key on my{' '}
        <a href={uhkHref}>Ultimate Hacking Keyboard 60 v2</a> mechanical
        keyboard with “Silent Pink” switches.
      </p>
    ),
  },
  'low-thumps': {
    title: 'Rubber Buttons',
    category: 'misc',
    description: (
      <p>
        The remote control for my standing desk has these soft rubber buttons.
        They don’t really produce much sound, but with a really-close microphone
        and a lot of noise reduction, we get these satisfying low thumps.
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
        <p>
          Try cranking the “Random Pitch” to around 0.25 for a fun musical
          effect!
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

  'asus-kbd-soft': {
    title: 'ASUS Keyboard (soft)',
    category: 'keyboard',
    description: (
      <>
        <p>
          In contrast to the other mechanical keyboards in this set, I also
          recorded the buttons on a cheap rubber-dome ASUS keyboard. This one
          came bundled with a budget desktop PC, alongside the mouse used for
          the <code>asus-mouse</code> sound.
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
    category: 'misc',
    description: (
      <p>
        A KVM switch is a device that allows multiple PCs to share the same USB
        peripherals like mouse/keyboard. I got a cheap one on Amazon years ago.
        This recording captures the sound of toggling between PCs.
      </p>
    ),
  },

  'treadmill-sharp': {
    title: 'Treadmill Remote (sharp)',
    category: 'misc',
    description: (
      <>
        <p>
          My <a href={urevoHref}>Urevo</a> walking pad came with a basic remote
          control with several buttons. They all have a slightly different
          character, so I recorded all three!
        </p>
        <p>This one feels tight and sharp to me.</p>
      </>
    ),
  },
  'treadmill-pitched': {
    title: 'Treadmill Remote (pitched)',
    category: 'misc',
    description: (
      <>
        <p>
          My <a href={urevoHref}>Urevo</a> walking pad came with a basic remote
          control with several buttons. They all have a slightly different
          character, so I recorded all three!
        </p>
        <p>This one has a tiny bit of a musical lilt to it.</p>
      </>
    ),
  },
  'treadmill-flinty': {
    title: 'Treadmill Remote (flinty)',
    category: 'misc',
    description: (
      <>
        <p>
          My <a href={urevoHref}>Urevo</a> walking pad came with a basic remote
          control with several buttons. They all have a slightly different
          character, so I recorded all three!
        </p>
        <p>
          I think this last one has some dust stuck in it or something, since
          some of the samples are a bit gritty.
        </p>
      </>
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

  'hi75-medium': {
    title: 'EPOMAKER x LEOBOG Hi75 (medium)',
    category: 'keyboard',
    description: (
      <p>
        In addition to the light-touch samples in <code>hi75-soft</code>, I also
        recorded some slightly harder keypresses on my{' '}
        <a href={hi75Href}>Hi75</a> mechanical keyboard. Honestly the difference
        is quite subtle unless you’re using a good set of speakers/headphones.
      </p>
    ),
  },
  'hi75-hard': {
    title: 'EPOMAKER x LEOBOG Hi75 (hard)',
    category: 'keyboard',
    description: (
      <p>
        Like <code>hi75-soft</code> and <code>hi75-medium</code>, this sound
        captures the sound of my <a href={hi75Href}>Hi75</a> mechanical
        keyboard. This time, though, I hit the keys with reckless abandon.
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
        bright clap-like sound.
      </p>
    ),
  },
  'guitar-toggle-off': {
    title: 'Guitar Toggle (off)',
    category: 'toggle',
    description: (
      <>
        <p>
          My <a href={revstarHref}>Yamaha Revstar</a> electric guitar has a
          toggle to switch between pickups. Switching to the neck pickup
          produces a duller knock-type sound.
        </p>
        <p>
          I know it sounds quite similar to <code>guitar-toggle-on</code>, but
          pay attention to the <i>release</i> sound specifically. The “on” sound
          gets brighter, while the “off” sound gets darker.
        </p>
      </>
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
        Using the <em>Current</em> VST synth, I created a button sound in
        Ableton Live. The “release” sound goes up in pitch, making this sound
        suitable for turning a toggle on.
      </p>
    ),
  },
  'synth-off': {
    title: 'Synthesized button, off',
    category: 'toggle',
    description: (
      <p>
        Using the <em>Current</em> VST synth, I created a button sound in
        Ableton Live. The “release” sound goes down in pitch, making this sound
        suitable for toggling something off.
      </p>
    ),
  },
  'lock-closed': {
    title: 'Lock (closed)',
    category: 'toggle',
    description: (
      <p>
        I recorded a heavy-duty combination lock being locked, to indicate
        something being locked or frozen.
      </p>
    ),
  },
  'lock-open': {
    title: 'Lock (open)',
    category: 'toggle',
    description: (
      <p>
        I recorded a heavy-duty combination lock snapping open, to indicate
        something being unlocked or released.
      </p>
    ),
  },
};
