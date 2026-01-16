import { useCallback, useRef } from "react";

export const useDiarySounds = (enabled: boolean = true) => {
  const lastTypingSoundRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playPageFlip = useCallback(() => {
    if (!enabled) return;
    try {
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') audioContext.resume();
      const duration = 0.5;
      const now = audioContext.currentTime;
      const bufferSize = audioContext.sampleRate * duration;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const envelope = Math.sin(Math.PI * t) * Math.pow(1 - t, 0.5);
        output[i] = (Math.random() * 2 - 1) * envelope * 0.4;
      }
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const bandpass = audioContext.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(2500, now);
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      noiseSource.connect(bandpass);
      bandpass.connect(gainNode);
      gainNode.connect(audioContext.destination);
      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch (error) {
      console.warn("Could not play page flip sound:", error);
    }
  }, [enabled, getAudioContext]);

  const playTypingSound = useCallback(() => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastTypingSoundRef.current < 35) return;
    lastTypingSoundRef.current = now;
    try {
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') audioContext.resume();
      const currentTime = audioContext.currentTime;
      const duration = 0.04 + Math.random() * 0.02;
      const bufferSize = Math.floor(audioContext.sampleRate * duration);
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        output[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2) * 0.15;
      }
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const highpass = audioContext.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(2000, currentTime);
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.08, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);
      noiseSource.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(audioContext.destination);
      noiseSource.start(currentTime);
      noiseSource.stop(currentTime + duration);
    } catch (error) {}
  }, [enabled, getAudioContext]);

  return { playPageFlip, playTypingSound };
};
