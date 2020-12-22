// import state from '../global-state';

const list = document.getElementById('list-items');
const tableSections = document.getElementsByClassName('table-section');
const tableState = {
  data: [],
  isListClick: false,
};

function generateTableCel(data, property, dataKeyList) {
  const tableColumn = document.getElementById(`${property}`);
  const tableValue = document.createElement('span');

  console.log(dataKeyList);
  console.log(data[0].country);
  console.log(data[0][property]);

  switch (true) {
    case tableState.isListClick:
      tableValue.innerHTML = data.forEach((el) => {
        // console.log(el[property]);
        if (el.country === dataKeyList) {
          return el[property];
        }
      });
      break;
    default:
      tableValue.innerHTML = data.reduce((sum, current) => sum + current[property], 0);
      break;
  }
  tableColumn.append(tableValue);
}

function generateTable(data, dataKeyList) {
  generateTableCel(data, 'cases', dataKeyList);
  generateTableCel(data, 'deaths', dataKeyList);
  generateTableCel(data, 'recovered', dataKeyList);
}

async function showData() {
  const responseCountries = await fetch('https://disease.sh/v3/covid-19/countries');
  tableState.data = await responseCountries.json();
  generateTable(tableState.data);
  console.log(tableState.data);
}

showData();

const removeTableItems = () => [...tableSections].forEach((el) => {
  [...el.getElementsByTagName('span')].forEach((item) => item.remove());
});

function listEvent(event) {
  tableState.isListClick = true;
  const { target } = event;
  const listElement = target.closest('.list__element');
  const dataKey = listElement.getAttribute('data-key');

  removeTableItems();
  generateTable(tableState.data, dataKey);
  // console.log(dataKey);
  console.log(tableState.data);

  tableState.isListClick = false;
}

list.addEventListener('click', listEvent);
