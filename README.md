# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



### вывод свободных слотов
http://localhost:8081/appointments/slots?masterId=1&startDate=2024-11-26&endDate=2024-11-26&startTime=09:00:00&endTime=17:00:00

### одна запись 
http://localhost:8081/appointments/slots/1

### блокирование слотов
http://localhost:8081/appointments/1/book/1

{appointmentId} — ID записи, которую вы хотите забронировать.
{slotId} — ID слота, который вы хотите забронировать.

BookedSlot — это конкретное бронирование.
Slot — универсальный объект для всех слотов, независимо от их статуса.
FreeSlot — это может быть логический вывод (отфильтрованный список Slot по isBooked = false).


### Обновление записи

http://localhost:8081/appointments/7?slotId=8

{
    "client": {
        "id": 1
    },
    "master": {
        "id": 1
    },
    "qualification": {
        "id": 1
    },
    "serviceSalon": {
        "id": 1
    },
    "masterQualificationService": {
        "id": 1
    },
    "dateTime": "2024-12-01T10:00:00",
    "freeSlot": {
        "id": 4
    }
}



### слоты
http://localhost:8081/free-slots

{
  "master": { "id": 1 },
  "masterQualificationService": { "id": 2 },
  "date": "2024-11-30",
  "startTime": "12:00:00",
  "endTime": "13:00:00",
  "status": "Свободно"
}


### поиск по слотам

http://localhost:8081/free-slots/filter?masterId=1&masterQualificationServiceId=1&startDate=2024-12-05


### http://localhost:8081/master-qualification-services
{
    "masterQualification": {
        "id": 1,
        "qualification": {
            "id": 1,
            "price": 1.5,
            "time": 3
        }
    },
    "service": {
        "id": 1,
        "basicPrice": 150.0,
        "basicTime": "PT1H30M"
    }
}

### GET http://localhost:8081/master-qualification-services

    {
        "id": 17,
        "masterQualification": {
            "id": 1,
            "master": {
                "id": 1,
                "name": "John Doe",
                "phoneNumber": "+123456789"
            },
            "qualification": {
                "id": 1,
                "name": "Новичок",
                "price": 1,
                "time": 2
            }
        },
        "service": {
            "id": 1,
            "name": "1221212",
            "basicPrice": 1500,
            "basicTime": "PT30M"
        },
        "price": 225.00,
        "estimatedTime": "PT4H30M"
    }

### запись
POST http://localhost:8081/slots/book/99,102,103
{
    "clientName": "Jane Doe1",
    "clientPhone": "+12345678943434441",
    "clientEmail": "jane.doe@example.com"
}

### отмена 
PUT http://localhost:8081/slots/cancel/{slotId}/{clientId}
