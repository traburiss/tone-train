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

export const getNoteDetails = (note: string) => {
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
