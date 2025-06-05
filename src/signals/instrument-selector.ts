import {signal} from './signal-element.js';

export enum MusicalInstrument {
  Guitar = "🎸",
  Piano = "🎹",
  Drums = "🥁",
  Violin = "🎻",
  Saxophone = "🎷",
  Trumpet = "🎺",
}

export const instrumentSelectorSignal = signal<keyof typeof MusicalInstrument | undefined>(undefined);