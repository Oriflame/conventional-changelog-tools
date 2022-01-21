import { extractVersionFormatted } from '../src/utils/extractVersion';

describe('extractVersionFormatted', () => {
  test.each([
    {
      original: '@ori-events/add-backorder-demand@2.0.0',
      expected: '2.0.0',
    },
    {
      original: '@ori-events/add-backorder-demand-failed@0.1.0',
      expected: '0.1.0',
    },
    {
      original: '@ori-events/add-backorder-demand@2.0.0-develop.1',
      expected: '2.0.0-develop.1',
    },
    {
      original: 'v2.0.0-develop.1',
      expected: '2.0.0-develop.1',
    },
    {
      original: 'v2.0.0',
      expected: '2.0.0',
    },
    {
      original: 'v2.0.1-stg.1',
      expected: '2.0.1-stg.1',
    },
    {
      original: 'v2.0.1-stg.2',
      expected: '2.0.1-stg.2',
    },
  ])('$original should return $expected', ({ original, expected }) => {
    expect(extractVersionFormatted(original)).toBe(expected);
  });

  test.each(['asdf', '@ori-events/add-backorder-demand-failed', '@asd'])(
    '%s should return undefined',
    (original) => {
      expect(extractVersionFormatted(original)).toBeUndefined();
    },
  );
});
