import './styles/style.css';
import ymaps from 'ymaps';

function createList(data) {
  ymaps.load().then((maps) => {
    const mapOptions = {
      center: [54.299638, 26.880958],
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

    const arrAll = data.sort((a, b) => b.deaths - a.deaths);
    const lll = [...Array(counriesColor.length).keys()].map(
      (_, i) => Math.floor(arrAll[0].deaths / counriesColor.length) * i,
    );

    maps.borders.load('001').then((geojson) => {
      for (let i = 0; i < data.length; i++) {
        const geoObjItem = geojson.features.find(
          (item) => item.properties.iso3166 === data[i].countryInfo.iso2,
        );

        let fillColor = lll.indexOf(lll.find((x) => data[i].deaths < x));
        fillColor = fillColor === -1 ? 8 : fillColor;

        const geoObject = new maps.GeoObject(geoObjItem, {
          fillColor: counriesColor[fillColor],
          strokeColor: '212529',
          strokeOpacity: 0.25,
          hintContent: 'test',
        });
        map.geoObjects.add(geoObject);
      }
    });
  });
}
async function showData() {
  const responseCountries = await fetch(
    'https://disease.sh/v3/covid-19/countries',
  );
  const data = await responseCountries.json();
  createList(data);
}
showData();
