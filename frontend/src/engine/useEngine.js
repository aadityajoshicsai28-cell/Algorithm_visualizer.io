import { useState, useRef, useEffect, useCallback } from 'react';
import { PlayerEngine, CancellationError } from './PlayerEngine';

export function useEngine(initialDelay = 120) {
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = new PlayerEngine({ defaultDelay: initialDelay });
  }
  const engine = engineRef.current;

  const [state, setState] = useState({
    running: false,
    paused: false,
    delay: initialDelay,
  });

  const [statusText, setStatusText] = useState('Ready to visualize. Press Play or Step to begin.');

  useEffect(() => {
    engine.onStateChange = (newState) => {
      setState({ ...newState });
    };
    return () => {
      engine.cancel();
    };
  }, [engine]);

  const play = useCallback(() => {
    engine.play();
  }, [engine]);

  const pause = useCallback(() => {
    engine.pause();
  }, [engine]);

  const step = useCallback(() => {
    engine.step();
  }, [engine]);

  const setSpeed = useCallback((delayMs) => {
    engine.setDelay(delayMs);
  }, [engine]);

  const reset = useCallback(() => {
    engine.cancel();
    setStatusText('Visualization reset.');
  }, [engine]);

  const startRun = useCallback(async (algorithmFn) => {
    const token = engine.createToken();
    try {
      await algorithmFn(async () => {
        await engine.wait(token);
      }, token);
      if (engine.activeToken !== token || token.cancelled) return;
      engine.finish();
      setStatusText(prev => prev.includes('Complete') ? prev : 'Algorithm finished execution.');
    } catch (err) {
      if (engine.activeToken !== token) return;
      if (err instanceof CancellationError || err.message === 'CANCELLED') {
        // expected when cancelled/reset
      } else {
        console.error('Algorithm execution error:', err);
        setStatusText(`Error: ${err.message}`);
        engine.cancel();
      }
    }
  }, [engine]);

  return {
    engine,
    running: state.running,
    paused: state.paused,
    delay: state.delay,
    statusText,
    setStatusText,
    play,
    pause,
    step,
    setSpeed,
    reset,
    startRun,
  };
}
