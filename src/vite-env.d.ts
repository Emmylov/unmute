/// <reference types="vite/client" />

interface Window {
  storyTimer: number | null;
}

declare module 'emoji-picker-react' {
  export interface EmojiClickData {
    emoji: string;
    names: string[];
    unified: string;
    originalUnified: string;
    activeSkinTone: string;
  }

  export interface EmojiPickerProps {
    onEmojiClick: (emojiData: EmojiClickData, event: MouseEvent) => void;
    searchPlaceholder?: string;
    width?: number | string;
    height?: number | string;
    preload?: boolean;
    skinTonesDisabled?: boolean;
    searchDisabled?: boolean;
    lazyLoadEmojis?: boolean;
    autoFocusSearch?: boolean;
    emojiStyle?: 'native' | 'apple' | 'google' | 'twitter' | 'facebook';
    theme?: 'light' | 'dark' | 'auto';
    categories?: string[];
    suggestedEmojisMode?: 'recent' | 'frequent';
  }

  const EmojiPicker: React.FC<EmojiPickerProps>;
  export default EmojiPicker;
}

declare module 'wavesurfer.js' {
  export default class WaveSurfer {
    constructor(options: any);
    load(url: string): void;
    play(): void;
    pause(): void;
    on(event: string, callback: () => void): void;
    destroy(): void;
    getDuration(): number;
    getCurrentTime(): number;
  }
}

declare module 'react-confetti' {
  import * as React from 'react';

  export interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    confettiSource?: {
      x?: number;
      y?: number;
      w?: number;
      h?: number;
    };
    recycle?: boolean;
    wind?: number;
    gravity?: number;
    colors?: string[];
    opacity?: number;
    run?: boolean;
    tweenDuration?: number;
    tweenFunction?: (currentTime: number, currentValue: number, targetValue: number, duration: number, s?: number) => number;
    drawShape?: (ctx: CanvasRenderingContext2D) => void;
    initialVelocityX?: number;
    initialVelocityY?: number;
  }

  const Confetti: React.FC<ConfettiProps>;
  export default Confetti;
}

declare module 'react-audio-visualizers' {
  export const AudioVisualizer: React.FC<any>;
  export const AUDIO_VISUALIZER_TYPE: Record<string, any>;
}

declare module 'gif-picker-react' {
  export interface TenorResult {
    id: string;
    title: string;
    media_formats: {
      gif?: {
        url: string;
        dims: number[];
        duration: number;
        size: number;
      };
      mediumgif?: {
        url: string;
        dims: number[];
        duration: number;
        size: number;
      };
      tinygif?: {
        url: string;
        dims: number[];
        duration: number;
        size: number;
      };
      [key: string]: any;
    };
    content_description: string;
    created: number;
    hasaudio: boolean;
    url: string;
  }

  export interface GifPickerProps {
    onGifClick: (gif: TenorResult) => void;
    tenorApiKey: string;
    clientKey?: string;
    country?: string;
    locale?: string;
    contentFilter?: 'off' | 'low' | 'medium' | 'high';
    mediaFilter?: 'basic' | 'minimal' | 'all';
    autoFocusSearch?: boolean;
    width?: number | string;
    height?: number | string;
    theme?: 'light' | 'dark';
    searchPlaceholder?: string;
    muted?: boolean;
  }

  const GifPicker: React.FC<GifPickerProps>;
  export default GifPicker;
}
