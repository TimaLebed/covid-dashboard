import state from '../global-state';

class List {
  constructor() {
    this.list = document.getElementById('list-items');
    this.listButtons = [...document.getElementsByClassName('list-buttons__element')];
    this.switchButtons = [...document.getElementsByClassName('switch')];
    this.PER_ONE_MILLION_STR = 'PerOneMillion';
    this.TODAY_STR = 'today';
  }

  static valuePerThousand(el) {
    return Math.round((el[state.activeState] * 10 ** 5) / el.population);
  }

  createList(data) {
    let dataSort = [];

    if (!state.isAllDay && !state.isAllPeople) {
      dataSort = data.sort((a, b) => List.valuePerThousand(b) - List.valuePerThousand(a));
    } else {
      dataSort = data.sort((a, b) => b[state.activeState] - a[state.activeState]);
    }

    dataSort.forEach((el) => {
      let listElementCase;

      switch (true) {
        case !state.isAllDay && !state.isAllPeople:
          listElementCase = List.valuePerThousand(el);
          break;
        case !state.isAllPeople:
          listElementCase = Math.round(el[state.activeState] / 10);
          break;
        default:
          listElementCase = el[state.activeState];
          break;
      }

      const listElement = document.createElement('div');

      listElement.classList.add('list__element');
      listElement.setAttribute('data-key', `${el.country}`);
      listElement.innerHTML = `
        <div>${listElementCase}</div>
        <div>${el.country}</div>
        <div style="background-image: url(${el.countryInfo.flag}" class="list__element--img"></div>
      `;

      this.list.append(listElement);
    });
  }

  async showData() {
    const responseCountries = await fetch('https://disease.sh/v3/covid-19/countries');

    state.data = await responseCountries.json();
    this.createList(state.data);
  }

  removeListItems() {
    [...this.list.childNodes].forEach((el) => el.remove());
  }

  static changeState(event, ListContext) {
    const { target } = event;

    state.activeState = target.getAttribute('data-key');
    ListContext.listButtons.forEach((button) => button.classList.remove('active'));
    target.classList.add('active');
    ListContext.removeListItems();
    ListContext.createList(state.data);
  }

  switchState(currentState) {
    let result = currentState.replace(this.PER_ONE_MILLION_STR, '');

    result = result.replace(this.TODAY_STR, '');
    result = result.toLowerCase();

    switch (true) {
      case !state.isAllPeople && state.isAllDay:
        result += this.PER_ONE_MILLION_STR;
        break;
      case (state.isAllPeople && !state.isAllDay)
        || (!state.isAllPeople && !state.isAllDay):
        result = this.TODAY_STR + result[0].toUpperCase() + result.slice(1);
        break;
      default:
        break;
    }

    return result;
  }

  static changeSwitch(event, ListContext) {
    const { target } = event;
    const switchDataKey = target.getAttribute('data-key');

    state[switchDataKey] = !state[switchDataKey];
    target.classList.toggle('none');
    ListContext.removeListItems();
    state.activeState = ListContext.switchState(state.activeState);
    ListContext.createList(state.data);
    ListContext.listButtons.forEach((btn) => btn.setAttribute('data-key', ListContext.switchState(btn.getAttribute('data-key'))));
  }

  init() {
    this.showData();
    this.switchButtons.forEach((button) => button.addEventListener('click', (event) => List.changeSwitch(event, this)));
    this.listButtons.forEach((button) => button.addEventListener('click', (event) => List.changeState(event, this)));
  }
}

export default List;
