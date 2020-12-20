import './styles/style.css';

const list = document.querySelector('.list-items');
const listButtons = [...document.getElementsByClassName('list-buttons__element')];
const switchPeople = document.getElementById('label-people');
const switchBillion = document.getElementById('switch-billion');
const switchThousand = document.getElementById('switch-thousand');
const switchDay = document.getElementById('label-day');
const switchAllDay = document.getElementById('switch-all-day');
const switchToday = document.getElementById('switch-today');
const state = {
  isCases: true,
  isDeaths: false,
  isRecovered: false,
  isAllDay: true,
  isAllPeople: true,
  data: [],
  dataKeyBtnChangeState: 'cases',
};

function createList(data, stateList) {
  const dataSort = data.sort((a, b) => b[stateList] - a[stateList]);
  console.log(dataSort);

  dataSort.forEach((el) => {
    const listElement = document.createElement('div');
    const listElementCase = document.createElement('p');
    const listElementCountry = document.createElement('p');
    const listElementImg = document.createElement('div');

    listElement.classList.add('list__element');
    listElementCase.classList.add('list__element--case');
    listElementCountry.classList.add('list__element--country');
    listElementImg.classList.add('list__element--img');

    // switch (true) {
    //   case state.isDeaths:
    //     console.log("Oranges are $0.59 a pound.");
    //     break;
    //   default:
    //     console.log("Sorry, we are out of " + expr + ".");
    // }

    if (!state.isAllPeople) {
      listElementCase.innerHTML = Math.round(el[stateList] / 10);
    } else {
      listElementCase.innerHTML = el[stateList];
    }

    listElementCountry.innerHTML = `${el.country}`;
    listElementImg.style.backgroundImage = `url(${el.countryInfo.flag}`;

    listElement.append(listElementCase, listElementCountry, listElementImg);
    list.append(listElement);
  });
}

async function showData() {
  const responseCountries = await fetch('https://disease.sh/v3/covid-19/countries');
  state.data = await responseCountries.json();
  createList(state.data, state.dataKeyBtnChangeState);
}

showData();

// fetch('https://disease.sh/v3/covid-19/countries')
//   .then((response) => response.json())
//   .then((data) => showData(data));

// fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag')
//   .then((response) => console.log(response.json()));

const removeListItems = () => [...list.childNodes].forEach((el) => el.remove());

function changeState(event) {
  const { target } = event;
  const dataKey = target.getAttribute('data-key');

  if (dataKey === 'recovered') {
    state.isRecovered = true;
    state.isCases = false;
    state.isDeaths = false;
  } else if (dataKey === 'deaths') {
    state.isDeaths = true;
    state.isCases = false;
    state.isRecovered = false;
  } else {
    state.isCases = true;
    state.isDeaths = false;
    state.isRecovered = false;
  }

  removeListItems();
  createList(state.data, dataKey);
}

function switchPeopleEvent() {
  state.isAllPeople = !state.isAllPeople;
  switchBillion.classList.toggle('none');
  switchThousand.classList.toggle('none');

  removeListItems();
  if (state.isAllPeople) {
    createList(state.data, state.dataKeyBtnChangeState);
  } else {
    createList(state.data, 'casesPerOneMillion');
  }
}

function switchDayEvent() {
  state.isAllDay = !state.isAllDay;
  switchAllDay.classList.toggle('none');
  switchToday.classList.toggle('none');

  removeListItems();
  if (state.isAllDay) {
    createList(state.data, state.dataKeyBtnChangeState);
  } else {
    createList(state.data, 'todayCases');
  }
}

switchPeople.addEventListener('click', switchPeopleEvent);
switchDay.addEventListener('click', switchDayEvent);
listButtons.forEach((button) => button.addEventListener('click', changeState));
