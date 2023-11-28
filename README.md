# Media-Matcher
This repository contains the code for Media-Matcher, an engaging way for users to keep track of movies and TV shows they enjoy in an easy-to-use clickable card format.

## What this project achieves
```
1. An extensive collection of movies and TV shows for users to watch.
2. A Media Overview that allows users to quickly receive basic information about a particular movie or TV show.
3. A Like/Dislike system that allows users to interact with movies and TV suggestions.
4. A Database containing movie and TV show information and the user’s media preferences. 
```

## How to install the project

1. Clone this repository
2. Install dependencies: express, mongoose and nodemon
```
  npm install -g express mongoose nodemon
```
3. Setup a Database with MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
4. Once Database is setup, copy connection string with proper authentication and paste into the index.js mongoose.connect(). 
```
mongoose.connect('INSERT-URL-HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
```
