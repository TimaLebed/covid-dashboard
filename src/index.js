import './styles/style.css';
import ymaps from 'ymaps';

ymaps.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU').then((maps) => {
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

  //   const pane = new maps.pane.StaticPane(map, {
  //     zIndex: 100,
  //     css: {
  //       width: '100%',
  //       height: '100%',
  //       backgroundColor: '#f7f7f7',
  //     },
  //   });
  //   map.panes.append('white', pane);

  maps.borders.load('001').then((geojson) => {
    for (let i = 0; i < geojson.features.length; i++) {
      const geoObject = new maps.GeoObject(geojson.features[i], {
        fillColor: '35c682',
        strokeColor: '26313c',
        strokeOpacity: 0.75,
        fillOpacity: 0.75,
      });
      map.geoObjects.add(geoObject);
    }
  });
});
