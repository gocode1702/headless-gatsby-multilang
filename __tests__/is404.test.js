import is404 from '../src/utils/is404';

test('Returns false if page exists', async () => {
  expect(await is404('https://headlessmultilingual.gatsbyjs.io/guide')).toBe(
    false
  );
});

test("Returns true if page doesn't exists", async () => {
  expect(
    await is404('https://headlessmultilingual.gatsbyjs.io/non-existent-page')
  ).toBe(true);
});
