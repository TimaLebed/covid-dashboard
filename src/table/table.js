import state from '../global-state';

const list = document.getElementById('list-items');
const tableSections = [...document.getElementsByClassName('table-section')];
const tableReset = document.getElementById('table-reset');

const switchButtons = [...document.getElementsByClassName('switch')];

const tableState = {
  data: [],
  dataKeyList: '',
  arrState: ['cases', 'deaths', 'recovered'],
};

const PER_ONE_MILLION_STR = 'PerOneMillion';
const TODAY_STR = 'today';

const valuePerThousand = (el, prop) => Math.round((el[prop] * 10 ** 5) / el.population);

function generateTableCel(data, property) {
  const tableColumn = document.getElementById(`${property}`);
  const tableValue = document.createElement('span');
  let variable;
  let dataItem;
  switch (true) {
    case tableState.dataKeyList.length > 0:
      dataItem = data.find((el) => el.country === tableState.dataKeyList);
      switch (true) {
        case !state.isAllDay && !state.isAllPeople:
          variable = valuePerThousand(dataItem, property);
          break;
        case !state.isAllPeople:
          variable = Math.round(dataItem[property] / 10);
          break;
        default:
          variable = dataItem[property];
          break;
      }
      tableValue.innerHTML = variable;
      break;
    default:
      switch (true) {
        case !state.isAllDay && !state.isAllPeople:
          variable = data.reduce((sum, current) => {
            let result;
            if (current[property]) {
              result = sum + valuePerThousand(current, property);
            } else {
              result = sum + 0;
            }
            return result;
          }, 0);
          break;
        case !state.isAllPeople:
          variable = Math.round(
            data.reduce((sum, current) => sum + current[property], 0) / 10,
          );
          break;
        default:
          variable = data.reduce((sum, current) => sum + current[property], 0);
          break;
      }
      tableValue.innerHTML = variable;
      break;
  }
  tableColumn.append(tableValue);
}

function generateTable(data) {
  tableState.arrState.forEach((element) => generateTableCel(data, element));
}

async function showData() {
  const responseCountries = await fetch(
    'https://disease.sh/v3/covid-19/countries',
  );
  tableState.data = await responseCountries.json();
  generateTable(tableState.data);
}

showData();

const removeTableItems = () => [...tableSections].forEach((el) => {
  [...el.getElementsByTagName('span')].forEach((item) => item.remove());
});

function listEvent(event) {
  const { target } = event;
  const listElement = target.closest('.list__element');
  const dataKey = listElement.getAttribute('data-key');

  removeTableItems();
  tableState.dataKeyList = dataKey;
  generateTable(tableState.data);
}

function resetEvent() {
  removeTableItems();
  tableState.dataKeyList = '';
  generateTable(tableState.data);
}

const switchState = (currentState) => {
  let result = currentState.replace(PER_ONE_MILLION_STR, '');
  result = result.replace(TODAY_STR, '');
  result = result.toLowerCase();
  switch (true) {
    case !state.isAllPeople && state.isAllDay:
      result += PER_ONE_MILLION_STR;
      break;
    case (state.isAllPeople && !state.isAllDay)
      || (!state.isAllPeople && !state.isAllDay):
      result = TODAY_STR + result[0].toUpperCase() + result.slice(1);
      break;
    default:
      break;
  }
  return result;
};

function changeSwitch() {
  removeTableItems();
  tableState.arrState = tableState.arrState.map((elem) => switchState(elem));
  tableSections.forEach((elem, index) => elem.setAttribute('id', tableState.arrState[index]));
  generateTable(tableState.data);
}

list.addEventListener('click', listEvent);
tableReset.addEventListener('click', resetEvent);
switchButtons.forEach((button) => button.addEventListener('click', changeSwitch));
