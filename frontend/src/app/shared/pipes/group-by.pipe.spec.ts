import { GroupByPipe } from './group-by.pipe';

describe('GroupByPipe', () => {
  const pipe = new GroupByPipe();

  it('should return null when collection is null', () => {
    expect(pipe.transform(null, 'type')).toBeNull();
  });

  it('should group items by provided field', () => {
    const arr = [
      { id: 1, type: 'fruit' },
      { id: 2, type: 'veg' },
      { id: 3, type: 'fruit' },
    ];
    const res = pipe.transform(arr, 'type') as any;
    expect(Object.keys(res).length).toBe(2);
    expect(res['fruit'].length).toBe(2);
    expect(res['veg'].length).toBe(1);
    expect(res['fruit'].map((i: any) => i.id)).toEqual([1, 3]);
  });
});
