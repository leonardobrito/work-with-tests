import { queryString, parse } from './queryString';

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const object = {
      name: 'Leonardo',
      profession: 'developer',
    };

    expect(queryString(object)).toBe('name=Leonardo&profession=developer');
  });

  it('should create a valid query string even when an array is passed as value', () => {
    const object = {
      name: 'Leonardo',
      abilities: ['Js', 'TDD'],
    };

    expect(queryString(object)).toBe('name=Leonardo&abilities=Js,TDD');
  });

  it('should throw an error when an object is passed as value', () => {
    const object = {
      name: 'Leonardo',
      abilities: {
        first: 'Js',
        second: 'TDD',
      },
    };

    expect(() => queryString(object)).toThrowError();
  });
});

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const queryString = 'name=Leonardo&profession=developer';

    expect(parse(queryString)).toEqual({
      name: 'Leonardo',
      profession: 'developer',
    });
  });

  it('should convert a query string of a single key-value to object', () => {
    const queryString = 'name=Leonardo';

    expect(parse(queryString)).toEqual({
      name: 'Leonardo',
    });
  });

  it('should convert a query string to an object taking care of comma separated values', () => {
    const queryString = 'name=Leonardo&abilities=Js,TDD';

    expect(parse(queryString)).toEqual({
      name: 'Leonardo',
      abilities: ['Js', 'TDD'],
    });
  });
});
