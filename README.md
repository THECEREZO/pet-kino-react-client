Установка и запуск
------------------
1. ```npm install``` - установить все зависимости **(потребуется NodeJS вместе с ним уже идет установщик пакетов, писал на Node v20.12.2)**
2. ```npm run build``` - собрать все файлы ```dist``` для сайта
3. ```npm run preview``` - запустить сервер на ```http://localhost:8080``` в производственной среде
 

Стек проекта
------------------

- ReactJS
	- react-router-dom (маршрутизация)
	- react-hook-form (валидация и отправка формы)
- Redux Toolkit & react-redux
	- redux-thunk
- Tailwind CSS
- Antd UI library
- Typescript
- Сборщик Vite

Маршрутизация 
------------------

+ ```http://localhost:8081``` — front-end client
	+ ```/create``` - создание фильма с помощью формы
	+ ```/videoplayer/:id``` - видео и вся информация про него созданный по форме
