// Required modules
var express = require("express");
var bodyParse = require("body-parser");
var session = require('express-session')
var mongoose = require("mongoose");
const store = new session.MemoryStore();
const e = require("express");

// Initialize Express
const app = express()
// Session configuration
app.use(session({
    secret: 'aFitjsuaijfvusiashfuoajsdh',
    cookie: { maxAge: 120000,}, // Set to 'None' for cross-site cookies},
    saveUninitialized: false,
    store
}));

// Middleware setup
app.use(bodyParse.json())
app.use(express.static('media-matcher'))
app.use(express.static('media-matcher/views'))
app.use(express.static('media-matcher/scripts'))
app.use(bodyParse.urlencoded({ extended: true }))


// MongoDB connection
mongoose.connect('mongodb+srv://test2:BElLVc5JkU1uONKl@media-match.scccma6.mongodb.net/', {
   // useNewUrlParser: true,
   // useUnifiedTopology: true
})


// Define schemas for MongoDB collections
const LogInSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
})

const movieSchema = new mongoose.Schema({
    _id: Number,
    backdrop_path: String,
    genres: [String],
    original_title: String,
    overview: String,
    poster_path: String,
    release_date: Date,
    title: String,
    contentType: String,
});

// Database connection handling
const db = mongoose.connection;
db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));


// Create models for MongoDB collections
const collection = new mongoose.model("users", LogInSchema);
const Movie = new mongoose.model("movies", movieSchema);

// Route for the root path

app.get("/", (req, res) => {

    res.set({
        "Allow-access-Allow-Origin": '*'
    })

    return res.redirect('home.html');

});


// Route for user signup page

app.get("/signup", (req, res)=>{
    return res.redirect("signup.html");
})


// Route for user signup form submission

app.post("/signup", (request, response)=>{
    const email = request.body.email;
    const password = request.body.password;
    const likedMovies = [];

    var data = {
        "email": email,
        "password": password,
        "likedMovies": likedMovies
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    })
    return response.redirect("index.html");
})


// Route for user login
app.post("/login", (req, res) => {
    console.log(req.sessionID)
    const { email, password } = req.body;
    if (email && password ) {
        if(req.session.authenticated){
            res.json(req.session);
        } else {
            db.collection('users').findOne({ email: email }, (err, user) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Internal Server Error");
                }
    
                if (!user) {
                    return res.redirect('signup.html');
                }
    
                if (user.password === password) {
                    req.session.authenticated = true;
                    req.session.user = email;
                    
                    return res.redirect('home.html');
                } else {
                    return res.status(401).send("Invalid Password");
                }
            });
        }
    }
});



// Route for user logout

app.get('/logout', (req, res) => {
    if (req.session.authenticated) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal Server Error');
            }
            // Redirect the user to the login page after logging out
            return res.redirect('index.html'); // Change to the appropriate URL
        });
    } else {
        // If the user is not authenticated, you can handle this case as needed.
        // For example, you can redirect to the login page or display an error message.
        return res.redirect('index.html'); // Change to the appropriate URL
    }
});

// Route to fetch and return all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch and return user's liked movies

app.get('/likedMovies', async (req, res) => {
    const username = req.session.user;
  
    try {
      const user = await collection.findOne({ email: username });
  
      if (user) {
        const likedMovies = user.likedMovies;
  
        // Use Promise.all to fetch all liked Movies concurrently
        const results = await Promise.all(
          likedMovies.map(async (likedMovie) => {
            try {
              return await Movie.findOne({ _id: likedMovie }).exec();
            } catch (err) {
              console.error('Error searching for document with ObjectID', likedMovie, ':', err);
              return null; // Return null for failed queries
            }
          })
        );
  
        res.json(results);
      }
    } catch (err) {
      console.error('Error retrieving user from the database:', err);
    }
  });
  


// Route to save liked movies to a user
app.post('/api/saveLikedMovie/:movieId', async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.session.user; // Get the username from the session

    try {
        // Look up the user based on the username and update their data
        const user = await collection.findOne({ email: username });

        if (user) {
            // Check if the movieId is already in the likedMovies array
            if (!user.likedMovies) {
                user.likedMovies = []; // Initialize likedMovies if it doesn't exist
            }

            if (!user.likedMovies.includes(movieId)) {
                user.likedMovies.push(movieId);

                // Update the user's likedMovies in the database
                await collection.updateOne({ email: username }, { $set: { likedMovies: user.likedMovies } });

                res.status(200).json({ message: 'Movie added to liked movies.' });
            } else {
                res.status(400).json({ message: 'Movie is already in liked movies.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error saving liked movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to remove a liked movie from a user's profile
app.delete('/api/removeLikedMovie/:movieId', async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.session.user; // Get the username from the session

    try {
        // Look up the user based on the username
        const user = await collection.findOne({ email: username });

        if (user) {
            if (!user.likedMovies) {
                user.likedMovies = [];
            }
            // Check if the movieId is in the likedMovies array
            const index = user.likedMovies.indexOf(movieId);
            if (index !== -1) {
                // Remove the movieId from the likedMovies array
                user.likedMovies.splice(index, 1);
                // Update the user's likedMovies in the database
                await collection.updateOne({ email: username }, { $set: { likedMovies: user.likedMovies } });

                res.status(200).json({ message: 'Movie removed from liked movies.' });
            } else {
                res.status(400).json({ message: 'Movie is not in liked movies.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error removing liked movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server on the specified port

var port = process.env.PORT || 3004;
app.listen(port, () => {
    console.log("PORT CONNECTED!");
})