import './styles/style.css';
import ymaps from 'ymaps';

const listButtons = [
  ...document.getElementsByClassName('list-buttons__element'),
];

const state = {
  isAllDay: true,
  isAllPeople: true,
  isTodayPerPeople: false,
  data: [],
  activeState: 'cases',
};

function createMap() {
  const oldMap = document.querySelector('#map > ymaps');
  if (oldMap) {
    oldMap.remove();
  }

  ymaps.load().then((maps) => {
    const mapOptions = {
      center: [15.489579, 32.581527],
      zoom: 1,
      controls: ['zoomControl'],
    };

    const mapRestrict = {
      restrictMapArea: false,
    };

    mapOptions.behaviors = window.innerWidth < 768 ? ['multiTouch'] : ['drag'];

    const map = new maps.Map('map', mapOptions, mapRestrict);

    const counriesColor = [
      '3598DB',
      '5393CB',
      '688FC1',
      '8A8AB0',
      '9488AB',
      'FF7477',
      'FF6F7D',
      'e74c3c',
      'C0392B',
    ];

    const arrAll = state.data.sort(
      (a, b) => b[state.activeState] - a[state.activeState],
    );
    const lll = [...Array(counriesColor.length).keys()].map(
      (_, i) => Math.floor(arrAll[0][state.activeState] / counriesColor.length) * i,
    );

    maps.borders.load('001').then((geojson) => {
      for (let i = 0; i < state.data.length; i++) {
        const geoObjItem = geojson.features.find(
          (item) => item.properties.iso3166 === state.data[i].countryInfo.iso2,
        );

        let fillColor = lll.indexOf(
          lll.find((x) => state.data[i][state.activeState] < x),
        );
        fillColor = fillColor === -1 ? counriesColor.length - 1 : fillColor;

        const geoObject = new maps.GeoObject(geoObjItem, {
          fillColor: counriesColor[fillColor],
          strokeColor: '212529',
          strokeOpacity: 0.25,
        });

        const geoObjectBaloon = new maps.GeoObject(
          {
            geometry: {
              type: 'Point',
              coordinates: [
                state.data[i].countryInfo.lat,
                state.data[i].countryInfo.long,
              ],
            },
            properties: {
              hintContent: state.data[i].country,
              balloonContentHeader: `${state.data[i].country}: ${
                state.activeState[0].toUpperCase() + state.activeState.slice(1)
              }`,
              balloonContentBody: `${state.data[i][state.activeState]}`,
            },
          },
          {
            preset: 'islands#circleDotIcon',
            iconColor: '#ff0000',
          },
        );

        map.geoObjects.add(geoObject);
        map.geoObjects.add(geoObjectBaloon);
      }
    });
  });
}
async function showData() {
  const responseCountries = await fetch(
    'https://disease.sh/v3/covid-19/countries',
  );
  state.data = await responseCountries.json();
  createMap();
}
showData();

function changeState(event) {
  const { target } = event;
  state.activeState = target.getAttribute('data-key');
  listButtons.forEach((button) => button.classList.remove('active'));
  target.classList.add('active');
  createMap();
}

listButtons.forEach((button) => button.addEventListener('click', changeState));
