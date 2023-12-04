# Media-Matcher
This repository contains the code for Media-Matcher, an engaging way for users to keep track of movies and TV shows they enjoy in an easy-to-use clickable card format.

## What this project achieves
```
1. An extensive collection of movies and TV shows for users to watch.
2. A Database containing movie and TV show information and the user’s media preferences.
3. A Like/Dislike system allows users to interact with movies and TV suggestions. 
4. A Sign-up/Login page that authenticates users' credentials before accessing the website.
5. A Media Overview that allows users to quickly receive basic information about a particular movie or TV show.
6. A Search by Category that includes Genre, Decade Released, and Type.
```

## How to install the project

1. Clone this repository
```
  git clone https://github.com/mganar/media-matcher.git
```
2. Install dependencies: express, mongoose and nodemon
```
  npm install -g express mongoose nodemon
```
3. Setup a Database with MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
4. Once the Database is set up, Open the GitHub directory you created and navigate to media-imports/index.js, copy and paste your personal connection string from MongoDB Atlas into mongoose.connect()  
```
mongoose.connect('<COPY_AND_PASTE_URL_HERE>', {    })
```
5. Open your terminal navigate to the Media-Matcher directory and type npm start to receive an output.
```
[nodemon] starting `node media-matcher/index.js`
PORT CONNECTED!
Connected to Database
```
6. After 'Connected to Database' is received open any web browser and type http://localhost:3000/
7. Welcome to Media-Matcher, create an account to start finding the best movies and TV shows!
