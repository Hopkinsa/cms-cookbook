import { CREATE_TAG_DATA, DELETE_TAG_DATA, FIND_TAG_BY_ID, GET_TAGS, UPDATE_TAG_DATA } from './tag-sql';

describe('tag SQL', () => {
  test('exports tag SQL strings', () => {
    expect(CREATE_TAG_DATA).toContain('INSERT');
    expect(FIND_TAG_BY_ID).toContain('SELECT');
    expect(GET_TAGS).toContain('SELECT');
    expect(UPDATE_TAG_DATA).toContain('UPDATE');
    expect(DELETE_TAG_DATA).toContain('DELETE');
  });
});