import List from './List';

const list = new List();
list.init();

test('1: check property name', () => {
  expect(list.TODAY_STR).toEqual('today');
});

test('2: calculate people', () => {
  expect(List.valuePerThousand({ cases: 10000, population: 28 })).toEqual(35714286);
});
