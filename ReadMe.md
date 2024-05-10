# Device Savings Analytics
Welcome to the Device Savings Analytics repository! This project serves device energy savings data as bar charts and allows filtering by date range and zooming.

## Usage & Running

### Prerequisites: 
To get started, please follow these instructions:

1. Clone the Repository: Clone this repository to your local machine.
2. Install Node.js: Ensure you have Node.js version 18.19.0 or higher installed on your system.
3. Configure Environment variables (Required): Set the database url value for the environment variable `DATABASE_URL` within the .env file in the server folder.
4. Install Dependencies (Optional  if using Docker): Run `npm install` in folders client, server respectively to install all the necessary dependencies.
5. Start the Server (Optional if using Docker) : Run `npm start` in folders client, server respectively to start the server. The API will be accessible at http://localhost:3000 and the backend will be using the port 5000 by default.
6. Run using Docker: To run the application using docker, ensure Docker is installed and Docker desktop is started and running, then run `docker compose up -d`.

## API Endpoints
This Node.js application provides the following endpoint:

### Savings Endpoint
Gets the device savings data categoried by Carbon savings(Tonnes) and Diesel savings(Litres) filtered by the provided date range. 

```http
GET /api/savings
```
__Query Parameters__
| __Query parameter__ | __Required/Optional__ | __Description__                                                                                                                                                          | __Type__ |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| id      | REQUIRED     | The unique device id for which you want to fetch the device savings data.                                                                          | Integer  |  |
| from    | REQUIRED     | The start date in ISO String format from which you want to fetch the device savings data.                                                                          | String   |  |
| to      | REQUIRED     | The end date in ISO String format until which you want to fetch the savings data.                                                                          | String   |  |
| timezone  | OPTIONAL  | The timezone as a string formatted to an Olson Timezone Identifier for which you want to display the savings data dates. If not specified will display dates in accordance with UTC | String   |  |

__Sample response__
```json
{
  "data": {
    "id": 10,
    "totalCarbonSavings": 21.038963219924003,
    "totalDieselSavings": 20955.204578368,
    "savingsPerDay": [
      {
        "2024-01-01": {
          "carbonSavings": 0.235307838357,
          "dieselSavings": 233.237273961
        }
      },
      {
        "2024-01-02": {
          "carbonSavings": 0.26588395406,
          "dieselSavings": 246.029338159
        }
      },
      {
        "2024-01-03": {
          "carbonSavings": 0.199436789382,
          "dieselSavings": 222.148344883
        }
      },
    ],
    "savingsPerMonth": [
      {
        "2024-01": {
          "carbonSavings": 0.700628581799,
          "dieselSavings": 701.414957003
        }
      }
    ]
  }
}
```
When no data available for provided data range, will return the following JSON

```json
 {"data": {}, "error": ""}
```

In case of error, returns the following JSON

```json
 {"data": {}, "error": "<error message>"}
```

## User Interface

A ReactJS application demonstrating interaction with the API. This UI allows users to:

- Select a device.
- Filter data by date, time range.
- View Total device savings data categoried by Carbon savings(Tonnes) and Diesel savings(Litres) for selected date range.
- Zoom in and out on the device savings graph (visualized with echarts.js)

#### UI Limitations

- Custom date range selection: When user provides custom date range, they have to press "Get Savings" button to get corresponding data and chart. Entry of custom date range will not fetch results until "Get Savings" button is pressed, and will show old data and chart.
- Gradual zoom-out: The project at the moment does not include functionality to gradually zoom-out on zoom-in from months to days. Instead, it will zoom out completely from days to months.
- Zoom will work correctly only when the user has the mouse pointer over the data bar when zooming in. This will ensure xAxis values are updated correctly on zoom-in from months to days and vice-versa.
- On zooming in from months to days, in days view the user has to zoom-in a little to enable zoom-out from days to months.

## Data Storage

The implemented solution stores data in MongoDB and uses Prisma to interact with the database.

## Technologies Used

- HTML
- CSS
- React (TypeScript) for Frontend
- Styled-components for styling
- RecoilJS for state management
- NodeJS + Express (TypeScript) for Backend
- MongoDb for Data storage
- Prisma ORM Database interaction
- Echarts.js for Data visualization


