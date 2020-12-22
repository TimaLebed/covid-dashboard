const list = document.querySelector('.list-items');
const listButtons = [...document.getElementsByClassName('list-buttons__element')];
const switchButtons = [...document.getElementsByClassName('switch')];

const PER_ONE_MILLION_STR = 'PerOneMillion';
const TODAY_STR = 'today';

const state = {
  isAllDay: true,
  isAllPeople: true,
  isTodayPerPeople: false,
  data: [],
  activeState: 'cases',
};

const valuePerThousand = (el) => Math.round((el[state.activeState] * 10 ** 5) / el.population);

function createList(data) {
  let dataSort = [];
  if (!state.isAllDay && !state.isAllPeople) {
    dataSort = data.sort((a, b) => valuePerThousand(b) - valuePerThousand(a));
  } else {
    dataSort = data.sort((a, b) => b[state.activeState] - a[state.activeState]);
  }

  dataSort.forEach((el) => {
    let listElementCase;
    switch (true) {
      case !state.isAllDay && !state.isAllPeople:
        listElementCase = valuePerThousand(el);
        break;
      case !state.isAllPeople:
        listElementCase = Math.round(el[state.activeState] / 10);
        break;
      default:
        listElementCase = el[state.activeState];
        break;
    }

    const listElement = document.createElement('div');
    listElement.className = 'list__element';
    listElement.innerHTML = `
      <div>${listElementCase}</div>
      <div>${el.country}</div>
      <div style="background-image: url(${el.countryInfo.flag}" class="list__element--img"></div>
    `;

    list.append(listElement);
  });
}

async function showData() {
  const responseCountries = await fetch('https://disease.sh/v3/covid-19/countries');
  state.data = await responseCountries.json();
  createList(state.data);
}

const removeListItems = () => [...list.childNodes].forEach((el) => el.remove());

function changeState(event) {
  const { target } = event;
  state.activeState = target.getAttribute('data-key');
  listButtons.forEach((button) => button.classList.remove('active'));
  target.classList.add('active');
  removeListItems();
  createList(state.data);
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
  const switchDataKey = this.getAttribute('data-key');
  state[switchDataKey] = !state[switchDataKey];
  this.classList.toggle('none');
  removeListItems();
  state.activeState = switchState(state.activeState);
  createList(state.data);
  listButtons.forEach((btn) => btn.setAttribute('data-key', switchState(btn.getAttribute('data-key'))));
}

showData();

switchButtons.forEach((button) => button.addEventListener('click', changeSwitch));
listButtons.forEach((button) => button.addEventListener('click', changeState));
