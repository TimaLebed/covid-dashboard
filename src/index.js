import './styles/style.css';

fetch(
  'https://api-maps.yandex.ru/2.1?apikey=82d09443-b436-46c9-aa64-d5e8a5310526&lang=ru_RU',
).then((response) => response.json());
