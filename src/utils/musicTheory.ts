export const NOTE_TO_SOLFEGE: Record<string, string> = {
  C: 'Do',
  'C#': '升Do',
  D: 'Re',
  'D#': '升Re',
  E: 'Mi',
  F: 'Fa',
  'F#': '升Fa',
  G: 'Sol',
  'G#': '升Sol',
  A: 'La',
  'A#': '升La',
  B: 'Si',
};

export const NOTE_TO_NUMBER: Record<string, string> = {
  C: '1',
  'C#': '升1',
  D: '2',
  'D#': '升2',
  E: '3',
  F: '4',
  'F#': '升4',
  G: '5',
  'G#': '升5',
  A: '6',
  'A#': '升6',
  B: '7',
};

// Basic Open Chords (Standard Tuning)
// C: x32010 -> C3, E3, G3, C4, E4
// D: xx0232 -> D3, A3, D4, F#4
// E: 022100 -> E2, B2, E3, G#3, B3, E4
// F: 133211 -> F2, C3, F3, A3, C4, F4
// G: 320003 -> G2, B2, D3, G3, B3, G4
// A: x02220 -> A2, E3, A3, C#4, E4
// B: x24442 -> B2, F#3, B3, D#4, F#4
// Em: 022000 -> E2, B2, E3, G3, B3, E4
// Am: x02210 -> A2, E3, A3, C4, E4
// Dm: xx0231 -> D3, A3, D4, F4
export const CHORD_DEFINITIONS: Record<string, string[]> = {
  C: ['C3', 'E3', 'G3', 'C4', 'E4'],
  D: ['D3', 'A3', 'D4', 'F#4'],
  E: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'],
  F: ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'],
  G: ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'],
  A: ['A2', 'E3', 'A3', 'C#4', 'E4'],
  B: ['B2', 'F#3', 'B3', 'D#4', 'F#4'],
  Em: ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'],
  Am: ['A2', 'E3', 'A3', 'C4', 'E4'],
  Dm: ['D3', 'A3', 'D4', 'F4'],
  Bm: ['B2', 'F#3', 'B3', 'D4', 'F#4'],
  'F#m': ['F#2', 'C#3', 'F#3', 'A3', 'C#4', 'F#4'], // F#m
  'C#m': ['C#3', 'G#3', 'C#4', 'E4', 'G#4'], // C#m
  Gm: ['G2', 'D3', 'G3', 'A#3', 'D4', 'G4'],
  // Power Chords
  C5: ['C3', 'G3', 'C4'],
  D5: ['D3', 'A3', 'D4'],
  E5: ['E2', 'B2', 'E3'],
  F5: ['F2', 'C3', 'F3'],
  G5: ['G2', 'D3', 'G3'],
  A5: ['A2', 'E3', 'A3'],
  B5: ['B2', 'F#3', 'B3'],
  // 7th Chords (Dom7)
  G7: ['G2', 'B2', 'D3', 'F3', 'G3', 'B3'],
  C7: ['C3', 'E3', 'G3', 'A#3', 'C4'],
  D7: ['D3', 'A3', 'C4', 'F#4'],
  E7: ['E2', 'B2', 'D3', 'G#3', 'B3', 'E4'],
  A7: ['A2', 'E3', 'G3', 'C#4', 'E4'],
  B7: ['B2', 'D#3', 'A3', 'B3', 'F#4'],
  // Major 7th (maj7)
  Cmaj7: ['C3', 'E3', 'G3', 'B3', 'E4'],
  Gmaj7: ['G2', 'D3', 'F#3', 'B3', 'D4'],
  Fmaj7: ['F3', 'C4', 'E4', 'A4'], // Often played x33210
  Amaj7: ['A2', 'E3', 'G#3', 'C#4', 'E4'],
  // Minor 7th (m7)
  Am7: ['A2', 'E3', 'G3', 'C4', 'E4'],
  Em7: ['E2', 'B2', 'D3', 'G3', 'B3', 'E4'],
  Dm7: ['D3', 'A3', 'C4', 'F4'],
  Bm7: ['B2', 'F#3', 'A3', 'D4', 'F#4'],
  'F#m7': ['F#2', 'C#3', 'E3', 'A3', 'C#4', 'F#4'],
  // Suspended (sus4)
  Dsus4: ['D3', 'A3', 'D4', 'G4'],
  Asus4: ['A2', 'E3', 'A3', 'D4', 'E4'],
  Esus4: ['E2', 'B2', 'E3', 'A3', 'B3', 'E4'],
  // Slash Chords
  'D/F#': ['F#2', 'A2', 'D3', 'A3', 'D4', 'F#4'], // Thumb over
  'C/G': ['G2', 'C3', 'E3', 'G3', 'C4', 'E4'],
  'G/B': ['B2', 'D3', 'G3', 'B3', 'G4'],
};

export const getChordNotes = (chord: string): string[] => {
  return CHORD_DEFINITIONS[chord] || [];
};

// Fingering: 6th string -> 1st string
// -1: x (mute)
// 0: 0 (open)
// >0: fret number
export const CHORD_FINGERINGS: Record<string, number[]> = {
  C: [-1, 3, 2, 0, 1, 0],
  D: [-1, -1, 0, 2, 3, 2],
  E: [0, 2, 2, 1, 0, 0],
  F: [1, 3, 3, 2, 1, 1], // Simplified or Barre
  G: [3, 2, 0, 0, 0, 3],
  A: [-1, 0, 2, 2, 2, 0],
  B: [-1, 2, 4, 4, 4, 2],
  Em: [0, 2, 2, 0, 0, 0],
  Am: [-1, 0, 2, 2, 1, 0],
  Dm: [-1, -1, 0, 2, 3, 1],
  Bm: [-1, 2, 4, 4, 3, 2],
  'F#m': [2, 4, 4, 2, 2, 2],
  'C#m': [-1, 4, 6, 6, 5, 4],
  Gm: [3, 5, 5, 3, 3, 3],
  C5: [-1, 3, 5, 5, -1, -1],
  D5: [-1, 5, 7, 7, -1, -1],
  E5: [0, 2, 2, -1, -1, -1],
  F5: [1, 3, 3, -1, -1, -1],
  G5: [3, 5, 5, -1, -1, -1],
  A5: [-1, 0, 2, 2, -1, -1],
  B5: [-1, 2, 4, 4, -1, -1],
  G7: [3, 2, 0, 0, 0, 1],
  C7: [-1, 3, 2, 3, 1, 0],
  D7: [-1, -1, 0, 2, 1, 2],
  E7: [0, 2, 0, 1, 0, 0],
  A7: [-1, 0, 2, 0, 2, 0],
  B7: [-1, 2, 1, 2, 0, 2],
  Cmaj7: [-1, 3, 2, 0, 0, 0],
  Gmaj7: [3, 2, 0, 0, 0, 2],
  Fmaj7: [-1, -1, 3, 2, 1, 0],
  Amaj7: [-1, 0, 2, 1, 2, 0],
  Am7: [-1, 0, 2, 0, 1, 0],
  Em7: [0, 2, 2, 0, 3, 0],
  Dm7: [-1, -1, 0, 2, 1, 1],
  Bm7: [-1, 2, 4, 2, 3, 2],
  'F#m7': [2, 4, 2, 2, 2, 2],
  Dsus4: [-1, -1, 0, 2, 3, 3],
  Asus4: [-1, 0, 2, 2, 3, 0],
  Esus4: [0, 2, 2, 2, 0, 0],
  'D/F#': [2, 0, 0, 2, 3, 2],
  'C/G': [3, 3, 2, 0, 1, 0],
  'G/B': [-1, 2, 0, 0, 0, 3],
};

export const getNoteDetails = (note: string) => {
  // Check if it is a chord
  if (CHORD_DEFINITIONS[note]) {
      return { solfege: note, number: note };
  }

  // Extract the pitch class (e.g., "C", "F#") from string like "C4", "F#5"
  // Regex matches one character A-G, optionally followed by #
  const match = note.match(/^([A-G]#?)/);
  if (!match) {
    return { solfege: '', number: '' };
  }
  const pitch = match[1];
  return {
    solfege: NOTE_TO_SOLFEGE[pitch] || '',
    number: NOTE_TO_NUMBER[pitch] || '',
  };
};
