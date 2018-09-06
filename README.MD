# Northcoders News Api

Welcome to the Northcoders News API! You can use this to access nc_news endpoints where you can get information on various articles, topics and users in the database. This is a responsive API where any incorrect inputs will pass you an error message and information on how to recifty the issue.
You can see the app here - [lou-nc-news](https://lou-nc-news.herokuapp.com/api)

## Getting Started

Fork this repository on Github.
Clone your forked repo to your hard drive with `git clone`.
cd into it and open.

### Prerequisites

Let's get all the software up and running by running the following command.

```js
 $ npm install
```

This will install the following :

```js
    chai: 4.1.2,
    mocha: 5.0.5,
    nodemon: 1.18.3,
    supertest: 3.0.0,
    body-parser: 1.18.3,
    express: 4.16.3,
    mongoose: 5.2.6
```

If you dont already have it, now is a great time to grab Postman too!
https://www.getpostman.com/

### Installing

Great, we are ready to roll!
Lets set up a config file next, in the root folder create a file named config.js

Inside we are going to the set the node enviroment and an object for test and devlopment enviroments.
We will export those at the end.

```js
const NODE_ENV = process.env.NODE_ENV || "dev";

const test = {
  DB_URL: "mongodb://localhost:27017/nc_news_test"
};

const dev = {
  DB_URL: "mongodb://localhost:27017/nc_news"
};

const config = { test, dev };

module.exports = config[NODE_ENV];
```

Now we are ready to get some data!

You can seed the database using

```js
npm run seed
```

In a seperate terminal. Set MongoDb running

```js
$ mongod
```

Then in your intergrated terminal use the command.

```js
$ npm run dev
```

Your server should now be up and running! Open Postman and go to

```html
localhost:9090/api
```

You can now use the routes on the homepage to GET and POST data.

## Running the tests

Run the test enviroment by ending the server connection and running the command

```js
npm run test
```

These tests ensure that the endpoints will behave as expected. Feel free to create your own should you wish!

## Break down into end to end tests

Inside each describe block of the test files a route has several tests laid out. The are tests for the routes working and failing so searches can be adjusted accordingly!

Here is an example:

```js
 it("GET /api/topics gives a 400 error with an invalid topic", () => {
    return request
      .get("/api/topics/banannas/articles")
      .expect(400)
      .then(res => {
        expect(res.body.msg).to.equal("topic not found");
      });
```

This is testing a route that needed a topic included but as "bannans" are not a valid topic an error will be sent back.

## Built With

- [mocha](https://mochajs.org/), [chai](http://www.chaijs.com/), [supertest](https://www.npmjs.com/package/supertest) - tesing.
- [postman](https://www.getpostman.com/), [nodemon](https://nodemon.io/) - dev testing.
- [body-parser](https://www.npmjs.com/package/body-parser), [express](https://expressjs.com/), [mongoose](http://mongoosejs.com/) - user interactions.
- [mongoDB](https://www.mongodb.com/) - database.
- [heroku](https://dashboard.heroku.com/apps) - deployment.

## Authors

- **Louise Wright**

## Acknowledgments

- Big thank you to the Northcoders team :)
