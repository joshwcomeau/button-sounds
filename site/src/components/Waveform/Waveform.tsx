import * as React from 'react';
import styled from 'styled-components';

const FILE = '/waveform-example.mp3';
const HEIGHT = 200;
const WAVEFORM_COLOR = 'hsl(155deg 100% 50%)';

function Waveform(props: React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const samplesRef = React.useRef<Float32Array | null>(null);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const samples = samplesRef.current;
    if (!canvas || !samples) {
      return;
    }

    const width = canvas.clientWidth;
    if (width <= 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const bufferWidth = Math.round(width * dpr);
    const bufferHeight = Math.round(HEIGHT * dpr);

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, HEIGHT);

    ctx.beginPath();
    ctx.strokeStyle = WAVEFORM_COLOR;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const midpoint = HEIGHT / 2;
    const samplesPerColumn = samples.length / width;

    for (let x = 0; x < width; x++) {
      const start = Math.floor(x * samplesPerColumn);
      const end = Math.min(
        samples.length,
        Math.max(start + 1, Math.ceil((x + 1) * samplesPerColumn)),
      );

      let min = 0;
      let max = 0;
      for (let i = start; i < end; i++) {
        const sample = samples[i];
        if (sample < min) {
          min = sample;
        }
        if (sample > max) {
          max = sample;
        }
      }

      const yTop = midpoint - max * midpoint;
      const yBottom = midpoint - min * midpoint;
      ctx.moveTo(x + 0.5, yTop);
      ctx.lineTo(x + 0.5, yBottom);
    }

    ctx.stroke();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        draw();
      });
    });
    observer.observe(canvas);

    const audioContext = new AudioContext();
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(FILE);
        if (!response.ok) {
          throw new Error(`Failed to load waveform audio (${response.status})`);
        }
        const buffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(buffer);
        if (cancelled) {
          return;
        }
        samplesRef.current = mixChannels(audioBuffer);
        draw();
      } catch (error) {
        if (!cancelled) {
          console.error(error);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      audioContext.close();
    };
  }, [draw]);

  return <Canvas ref={canvasRef} {...props} />;
}

function mixChannels(audioBuffer: AudioBuffer) {
  const length = audioBuffer.length;
  const mixed = new Float32Array(length);
  const channelCount = audioBuffer.numberOfChannels;

  for (let channel = 0; channel < channelCount; channel++) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      mixed[i] += data[i] / channelCount;
    }
  }

  return mixed;
}

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: ${HEIGHT}px;
  background: transparent;
`;

export default Waveform;
