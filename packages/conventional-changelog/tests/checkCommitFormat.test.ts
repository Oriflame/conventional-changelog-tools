import checkCommitFormat from '../src/checkCommitFormat';

describe('checkCommitFormat()', () => {
  it('returns null when no match', () => {
    expect(checkCommitFormat('Random string')).toBeNull();
    expect(checkCommitFormat('type')).toBeNull();
    expect(checkCommitFormat('bad: Invalid type')).toBeNull();
    expect(checkCommitFormat('new Missing colon')).toBeNull();
  });

  it('returns the type without scope', () => {
    expect(checkCommitFormat('new: Added something')).toEqual({ type: 'new', scope: '' });
  });

  it('returns the type and scope', () => {
    expect(checkCommitFormat('update(foo): Updated something')).toEqual({
      type: 'update',
      scope: 'foo',
    });
  });

  it('supports dashes and numbers', () => {
    expect(checkCommitFormat('fix(foo-123): Did something')).toEqual({
      type: 'fix',
      scope: 'foo-123',
    });
  });

  it('supports comma separated', () => {
    expect(checkCommitFormat('ci(foo,bar): Did something')).toEqual({
      type: 'ci',
      scope: 'foo,bar',
    });
  });

  it('supports upper case scopes', () => {
    expect(checkCommitFormat('ci(FooBar): Did something')).toEqual({
      type: 'ci',
      scope: 'FooBar',
    });
  });

  it('supports spaces', () => {
    expect(checkCommitFormat('ci(Foo, Bar Baz): Did something')).toEqual({
      type: 'ci',
      scope: 'Foo, Bar Baz',
    });
  });

  it('supports azure devops format', () => {
    expect(checkCommitFormat('Merged PR 21884: fix: Type of lastAddedCustomerOrderIds.')).toEqual({
      type: 'fix',
      scope: '',
    });
    expect(
      checkCommitFormat(
        'Merged PR 21884: breaking(test-scope): Type of lastAddedCustomerOrderIds.',
      ),
    ).toEqual({
      type: 'breaking',
      scope: 'test-scope',
    });
    expect(
      checkCommitFormat(
        'Merged PR 21884: new(test-scope, Test): Type of lastAddedCustomerOrderIds.',
      ),
    ).toEqual({
      type: 'new',
      scope: 'test-scope, Test',
    });
  });
});
