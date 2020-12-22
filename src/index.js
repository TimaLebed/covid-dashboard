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
      restrictMapArea: true,
    };

    mapOptions.behaviors = window.innerWidth < 768 ? ['multiTouch'] : ['drag'];

    const map = new maps.Map('map', mapOptions, mapRestrict);

    // const pane = new maps.pane.StaticPane(map, {
    //   zIndex: 100,
    //   css: {
    //     width: '100%',
    //     height: '100%',
    //     backgroundColor: '#f7f7f7',
    //   },
    // });
    // map.panes.append('white', pane);

    console.log(data);

    for (let i = 0; i < data.length; i++) {
      const myCircle = new maps.Circle([
        // Координаты центра круга.
        [data[i].countryInfo.lat, data[i].countryInfo.long],
        // Радиус круга в метрах.
        10000,
      ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: `death - ${data[i].deaths}`,
        // Содержимое хинта.
        hintContent: 'Подвинь меня',
      }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: '#DB709377',
        // Цвет обводки.
        strokeColor: '#990066',
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 5,
      });
      map.geoObjects.add(myCircle);
    }
    // Добавляем круг на карту.

    // maps.borders.load('001').then((geojson) => {
    //   console.log(geojson);
    //   console.log(data);

    //   for (let i = 0; i < data.length; i++) {
    //     geojson.features.forEach((item) => {
    //       if (item.properties.iso3166 === data[i].countryInfo.iso2) {
    //         console.log('test');
    //         const geoObject = new maps.GeoObject(item, {
    //           fillColor: '35c682',
    //           strokeColor: '26313c',
    //           strokeOpacity: 0.75,
    //           fillOpacity: 0.75,
    //         });
    //         map.geoObjects.add(geoObject);
    //       }
    //     });
    //   }
    // });
  });
}
async function showData() {
  const responseCountries = await fetch('https://disease.sh/v3/covid-19/countries');
  const data = await responseCountries.json();
  createList(data);
}
showData();
