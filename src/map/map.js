import ymaps from 'ymaps';
import state from '../global-state';

const listButtons = [
  ...document.getElementsByClassName('list-buttons__element'),
];

const mapState = {
  data: [],
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

    const arrAll = mapState.data.sort(
      (a, b) => b[state.activeState] - a[state.activeState],
    );
    const lll = [...Array(counriesColor.length).keys()].map(
      (_, i) => Math.floor(arrAll[0][state.activeState] / counriesColor.length) * i,
    );

    maps.borders.load('001').then((geojson) => {
      for (let i = 0; i < mapState.data.length; i++) {
        const geoObjItem = geojson.features.find(
          (item) => item.properties.iso3166 === mapState.data[i].countryInfo.iso2,
        );

        let fillColor = lll.indexOf(
          lll.find((x) => mapState.data[i][state.activeState] < x),
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
                mapState.data[i].countryInfo.lat,
                mapState.data[i].countryInfo.long,
              ],
            },
            properties: {
              hintContent: mapState.data[i].country,
              balloonContentHeader: `${mapState.data[i].country}:`,
              balloonContentBody: `${mapState.data[i][state.activeState]}`,
              balloonContentFooter: `${
                state.activeState[0].toUpperCase() + state.activeState.slice(1)
              }`,
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
  mapState.data = await responseCountries.json();
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
