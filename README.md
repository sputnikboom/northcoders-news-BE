# NC News

A simple news aggregator that allows users to search for and comment on stories related to topics they are interested in.

A live version can be viewed at: [nc-news-rachael.herokuapp.com/](nc-news-rachael.herokuapp.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Before starting, you should ensure the following are installed:

[Node v8.12](https://nodejs.org)

[MongoDB v4.0](https://www.mongodb.com)

For this project, you will also require the following dependencies:

```
"dependencies": {
    "body-parser": "^1.18.3",
    "express": "^4.16.3",
    "mongoose": "^5.2.17"
  },
"devDependencies": {
    "chai": "^4.2.0",
    "mocha": "^5.2.0",
    "nodemon": "^1.18.4",
    "supertest": "^3.3.0"
```

### Installing

1. Fork and clone this repository onto your own local machine.

2. Install the required node dependencies:

```
$ npm i
```

3. Create a config file for the project:

```
$ mkdir config
$ touch config.js
```

4. Your config file should look similar to this. Don't forget to add this to your .gitignore!

```js
const NODE_ENV = process.env.NODE_ENV || "development";

const config = {
  test: { DB_URL: "mongodb://localhost:27017/<test _database_name>" },
  development: { DB_URL: "mongodb://localhost:27017/<database_name>" }
};

module.exports = config[NODE_ENV];
```

5. Before seeding the database you first need to make sure that mongo is open and running:
```
$ mongod
```

6. To seed the development database, you can use the following::
```
$ npm run seed:dev
```

## Running the tests

You can run the provided tests with the following script:

```
$ npm test
```

The test database will automatically re-seed after every test, so you don't need to worry about doing this manually. How handy!


## Deployment

The live version of this app was deployed using:

[mLab](https://mlab.com)
to host the database

[Heroku](https://heroku.com)
to host the api

To set up the project for deployment, you'll need to:

1. Add the URI for your mLab database to your config file. Keep note of this, as you'll need to add it as a config var if hosting on heroku:

```
  production: {DB_URL: "mongodb://<db_username>:<db_password>@ds115543.mlab.com:15543/<db_name>"}
```

2. Seed your database to mLab:

```
$ NODE_ENV=production node seed/seed.dev.js
```

## Authors

- **Rachael Hall** - [sputnikboom](https://github.com/sputnikboom)

## License

This project is licensed under the MIT License

## Acknowledgments

- Many thanks to the fantastic tutors at Northcoders
- And especially to [Tom](https://github.com/tomosim)
