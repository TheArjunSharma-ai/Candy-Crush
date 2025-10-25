import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SoundContextProps {
  isSoundOn: boolean;
  toggleSound: () => void;
  playSound: (soundName: string, repeat?: boolean) => Promise<void>;
  stopSound: (soundName: string) => Promise<void>;
}

interface SoundProviderProps {
  children: React.ReactNode;
}

const soundContext = createContext<SoundContextProps | undefined>(undefined);

const soundPaths: Record<string, any> = {
  ui: require("../../assets/sounds/ui.mp3"),
  candy_shuffle: require("../../assets/sounds/candy_shuffle.mp3"),
  candy_clear: require("../../assets/sounds/candy_clear.mp3"),
  bg: require("../../assets/sounds/bg.mp3"),
  cheer: require("../../assets/sounds/cheer.mp3"),
  // click: require("../../assets/sounds/click.mp3"),
  // crush: require("../../assets/sounds/crush.mp3"),
  // background: require("../../assets/sounds/background.mp3"),
};

type SoundEntry = {
  soundName: string;
  soundObj: Audio.Sound;
};

const SoundProvider = ({ children }: SoundProviderProps) => {
  const [sounds, setSounds] = useState<SoundEntry[]>([]);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // playSound loads and plays a sound (or restarts if already present)
  const playSound = async (soundName: string, repeat = false) => {
    if (!isSoundOn) return;
    const path = soundPaths[soundName];
    if (!path) {
      console.error(`Sound ${soundName} not found`);
      return;
    }

    // stop existing same-named sound first
    await stopSound(soundName);

    try {
      const soundObj = new Audio.Sound();
      await soundObj.loadAsync(path, {
        shouldPlay: true,
        isLooping: !!repeat,
        volume: 0.4,
      });
      setSounds((prev) => [...prev, { soundName, soundObj }]);
    } catch (err) {
      console.error("Error playing sound", soundName, err);
    }
  };

  // stopSound unloads and removes from state
  const stopSound = async (soundName: string) => {
    const entry = sounds.find((s) => s.soundName === soundName);
    if (!entry) return;
    try {
      await entry.soundObj.stopAsync().catch(() => {});
      await entry.soundObj.unloadAsync().catch(() => {});
    } catch (err) {
      // ignore unload errors
    } finally {
      setSounds((prev) => prev.filter((s) => s.soundName !== soundName));
    }
  };

  const toggleSound = async () => {
    const newVal = !isSoundOn;
    setIsSoundOn(newVal);
    if (!newVal) {
      // turning off: stop all sounds
      await Promise.all(
        sounds.map(async (s) => {
          try {
            await s.soundObj.stopAsync().catch(() => {});
            await s.soundObj.unloadAsync().catch(() => {});
          } catch (_) {}
        })
      );
      setSounds([]);
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      sounds.forEach(async (s) => {
        try {
          await s.soundObj.stopAsync().catch(() => {});
          await s.soundObj.unloadAsync().catch(() => {});
        } catch (_) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 
  return (
    <soundContext.Provider value={{ isSoundOn, toggleSound, playSound, stopSound }}>
      {children}
    </soundContext.Provider>
  );
};

const useSound = ():SoundContextProps=>{
  const context = useContext(soundContext);
  if(!context){
    throw new Error("use Sound must be within a soundProvider")
  }
  return context;
}

export { SoundProvider, useSound };

