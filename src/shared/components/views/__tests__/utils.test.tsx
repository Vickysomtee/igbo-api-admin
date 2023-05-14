import { sanitizeArray, sanitizeExamples, sanitizeIds } from '../components/utils';

describe('Word Edit Form utils', () => {
  it('sanitizes an array', () => {
    const mockData = ['', 'real', 'data', 'here ', false, null];

    expect(sanitizeArray(mockData)).toEqual(['real', 'data', 'here']);
  });

  it('converts array of objects with an id key objects into array of ids', () => {
    const mockData = [{ id: 'first' }, { id: 'second' }, { id: 'third' }];

    expect(sanitizeIds(mockData)).toEqual(['first', 'second', 'third']);
  });

  it('converts array of objects with an id key with one null value into an array of ids', () => {
    const mockData = [{ id: 'first' }, { id: 'second' }, { id: 'third' }, null];

    expect(sanitizeIds(mockData)).toEqual(['first', 'second', 'third']);
  });

  it('sanitizes an array of examples', () => {
    const mockData = [
      {
        igbo: 'igbo',
        english: 'english',
        meaning: 'meaning',
        nsibidi: 'nsibidi',
        nsibidiCharacters: [{ id: 'first' }],
        pronunciation: '',
      },
    ];

    expect(sanitizeExamples(mockData)).toEqual([{
      igbo: 'igbo',
      english: 'english',
      meaning: 'meaning',
      nsibidi: 'nsibidi',
      nsibidiCharacters: ['first'],
      pronunciation: '',
      associatedWords: undefined,
    }]);
  });
});
