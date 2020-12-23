import Chart from 'chart.js';

const list = document.getElementById('list-items');
const graphTitle = document.getElementById('graph-title');
const listButtons = [...document.getElementsByClassName('list-buttons__element')];
// const switchButtons = [...document.getElementsByClassName('switch')];
const popCanvas = document.getElementById('popChart').getContext('2d');
const TWO_MONTHS = 60;
const stateGraph = {
  dataTime: [],
  dataValue: [],
  currentState: 'cases',
  currentCountry: 'all',
  isAllCountries: true,
};
let barChart;

function graphGenerate(data, states) {
  let arr = [];

  switch (true) {
    case stateGraph.isAllCountries:
      arr = Object.entries(data[states]).slice(-TWO_MONTHS);
      graphTitle.textContent = 'The World';
      break;
    default:
      arr = Object.entries(data.timeline[states]).slice(-TWO_MONTHS);
      graphTitle.textContent = stateGraph.currentCountry;
      break;
  }

  arr.forEach((el) => {
    stateGraph.dataTime.push(el[0]);
    stateGraph.dataValue.push(el[1]);
  });

  barChart = new Chart(popCanvas, {
    type: 'bar',
    data: {
      labels: stateGraph.dataTime,
      datasets: [{
        label: stateGraph.currentState,
        data: stateGraph.dataValue,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
      }],
    },
  });
}

async function showData(country, states) {
  const responseCounty = await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`);
  const data = await responseCounty.json();
  graphGenerate(data, states);
}

showData(stateGraph.currentCountry, stateGraph.currentState);

function removeItemsArr() {
  stateGraph.dataTime.length = 0;
  stateGraph.dataValue.length = 0;
}

function listItemsEvent(event) {
  const { target } = event;
  const listElement = target.closest('.list__element');
  const dataKey = listElement.getAttribute('data-key');

  stateGraph.isAllCountries = false;
  stateGraph.currentCountry = dataKey;
  removeItemsArr();
  showData(dataKey, stateGraph.currentState);
  barChart.update();
}

function listButtonsEvent(event) {
  const { target } = event;
  const { textContent } = target;
  const stateB = textContent[0].toLowerCase() + textContent.slice(1);

  stateGraph.currentState = stateB;
  removeItemsArr();
  showData(stateGraph.currentCountry, stateB);
  barChart.update();
}

// function switchButtonsEvent(event) {
//   if (!state.isAllPeople) {
//     console.log(state.isAllPeople);
//   }
// }

list.addEventListener('click', listItemsEvent);
listButtons.forEach((button) => button.addEventListener('click', listButtonsEvent));
// switchButtons.forEach((button) => button.addEventListener('click', switchButtonsEvent));
