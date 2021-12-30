import {
  getLangCode,
  getLangsCode,
  getSecondaryLangs,
  findSecondaryLang,
} from '../src/utils/misc';

// getLangCode

test("Returns 'it' if lang code is 'it-IT", () => {
  expect(getLangCode('it-IT')).toBe('it');
});

test("Returns 'it' if lang code is 'it'", () => {
  expect(getLangCode('it')).toBe('it');
});

// getLangsCode

test('Returns lang', () => {
  expect(getLangsCode(['it', 'es-ES', 'en-GB'])).toStrictEqual([
    'it',
    'es',
    'en',
  ]);
});

// getSecondaryLangs

test('Removes first array item', () => {
  expect(getSecondaryLangs(['it', 'es-ES', 'en'])).toStrictEqual([
    'es-ES',
    'en',
  ]);
});

// findSecondaryLang

test('Returns exact matching lang code', () => {
  expect(findSecondaryLang(['de-CH', 'en-US', 'en-GB'], 'en-US')).toBe('en-US');
  expect(findSecondaryLang(['de-CH', 'en', 'en-GB'], 'en')).toBe('en');
});

test('Returns falsy value if no language match', () => {
  expect(findSecondaryLang(['en', 'en-US'], 'en-GB')).toBeFalsy();
  expect(findSecondaryLang(['en', 'en-US'], 'es')).toBeFalsy();
});
