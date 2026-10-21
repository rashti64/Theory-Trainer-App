/**
 * Sound and haptic feedback: a bright chime and a success tap when right,
 * a soft bonk and an error buzz when wrong, a fanfare at the finish line.
 * Learners can switch sounds off in their profile; haptics follow the system.
 */
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';

import { useAppState } from '@/state/app-state';

const SOURCES = {
  correct: require('@/assets/sounds/correct.wav'),
  wrong: require('@/assets/sounds/wrong.wav'),
  complete: require('@/assets/sounds/complete.wav'),
  tap: require('@/assets/sounds/tap.wav'),
};

export function useFeedback() {
  const { state } = useAppState();
  const soundOn = state.soundOn;
  const correctPlayer = useAudioPlayer(SOURCES.correct);
  const wrongPlayer = useAudioPlayer(SOURCES.wrong);
  const completePlayer = useAudioPlayer(SOURCES.complete);
  const tapPlayer = useAudioPlayer(SOURCES.tap);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
  }, []);

  const play = useCallback(
    (player: ReturnType<typeof useAudioPlayer>) => {
      if (!soundOn) return;
      try {
        player.seekTo(0);
        player.play();
      } catch {
        // Audio is a nicety; never let it break a lesson.
      }
    },
    [soundOn],
  );

  return {
    correct: useCallback(() => {
      play(correctPlayer);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }, [correctPlayer, play]),
    wrong: useCallback(() => {
      play(wrongPlayer);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }, [play, wrongPlayer]),
    complete: useCallback(() => {
      play(completePlayer);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }, [completePlayer, play]),
    tap: useCallback(() => {
      play(tapPlayer);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }, [play, tapPlayer]),
  };
}
