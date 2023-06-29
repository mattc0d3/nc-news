# Northcoders News API

Link to hosted database: LINK

This project creates and seeds a database of articles and user data that can be accessed programmatically by a front-end news forum style service. Using a Javascript API, clients can access several endpoints to request, post, update and delete data.

# Use Guide:
- Download project from https://github.com/mattc0d3/nc-news
- Clone in terminal with following command: ‘git clone https://github.com/mattc0d3/nc-news.git’
- Open in code editor
- Install dependencies
  - Install npm package manager for Javascript
  - Download and install PostgreSQL for database management
  - Install express web application framework
  - Install jest and supertest for unit and integration testing, respectively
- Create development and test database with command: ‘npm run set-dbs’
- Add data to the development database with command: ‘npm run seed’
- To start the API’s server locally, enter command: ‘npm start’
- Run test suite with command: ‘npm test app’

# Database Environment Variables:
- Script requires two databases - test and development - in order to be run. 
- These should be set as environment variables in separate .env files and referenced dynamically in the config path for the dotenv package within db/connection.js

# Minimum Requirements:
- Visual Studio Code or alternative source-code editor
- JavaScript
- PostgreSQL version 8.7.3 or higher
- Node.js version v20.0.0 or higher
- npm
- Express

# Endpoints:

- GET /api
  - serves up a json representation of all the available endpoints of the api

- GET /api/topics
  - serves an array of all topics

- GET /api/articles
  - serves an array of all topics, accepting queries for author, topic, sort_by and order

- POST /api/articles
  - adds an article linked to a specified user and topic

- GET /api/articles/:article_id
  - serves an object containing all data from a specified article

- GET /api/articles/:article_id/comments
  - serves an array of comments matching specified article ID

- PATCH /api/articles/article_id
  - updates specified article and named properties with new values

- POST /api/articles/:article_id/comments
  - adds a comment linked to a specified article ID and username

- PATCH /api/comments/:comment_id
  - updates specified comment and named properties with new values

- DELETE /api/comments/:comment_id
  - removes comment according to specified ID, no data returned

- GET /api/users
  - serves an array of all users

- GET /api/users/:username
  - serves an object containing all data for specified user

# Database Schema

- topics: 
  - slug (primary key)
  - description 
  - name

- users 
  - username (primary key)
  - avatar_url 
  - name

- articles
  - article_id (primary key)
  - title 
  - topic (foreign key)
  - author (foreign key)
  - body 
  - created_at
  - votes
  - article_img_url

- comments
  - comment_id (primary key)
  - body
  - article_id (foreign key)
  - author (foreign key)
  - votes
  - created_at

# Authors
- Matt Sheehan

# Acknowledgements
- Northcoders
