import List from './List';

const list = new List();
list.init();

test('1: example', () => {
  expect(list.TODAY_STR).toEqual('today');
});
