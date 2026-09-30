import * as React from 'react';

interface SoundSettings {
  usingLofi: boolean;
  setUsingLofi: React.Dispatch<React.SetStateAction<boolean>>;
  pitchVariation: number;
  setPitchVariation: React.Dispatch<React.SetStateAction<number>>;
}

const SoundSettingsContext = React.createContext<SoundSettings | null>(null);

function SoundSettingsProvider({ children }: { children: React.ReactNode }) {
  const [usingLofi, setUsingLofi] = React.useState(false);
  const [pitchVariation, setPitchVariation] = React.useState(0.2);

  const value = React.useMemo(
    () => ({
      usingLofi,
      setUsingLofi,
      pitchVariation,
      setPitchVariation,
    }),
    [usingLofi, pitchVariation],
  );

  return (
    <SoundSettingsContext.Provider value={value}>
      {children}
    </SoundSettingsContext.Provider>
  );
}

export function useSoundSettings() {
  const settings = React.useContext(SoundSettingsContext);

  if (!settings) {
    throw new Error(
      'useSoundSettings must be used within a SoundSettingsProvider',
    );
  }

  return settings;
}

export default SoundSettingsProvider;
