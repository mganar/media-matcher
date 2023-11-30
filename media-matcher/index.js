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
   useNewUrlParser: true,
   useUnifiedTopology: true
})


var db = mongoose.connection;
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
    likedMedias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
})

const mediaSchema = new mongoose.Schema({
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

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));
// Create models for MongoDB collections

const collection = new mongoose.model("users", LogInSchema);
const Media = new mongoose.model("medias", mediaSchema);
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
    const likedMedias = [];

    var data = {
        "email": email,
        "password": password,
        "likedMedias": likedMedias
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

  // Define an API endpoint to retrieve medias
app.get('/api/medias', async (req, res) => {
  try {
    const medias = await Media.find();
    res.json(medias);
} catch (error) {
    console.error('Error fetching media data:', error);
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to fetch and return user's liked medias

app.get('/likedMedias', async (req, res) => {
    const username = req.session.user;
  
    try {
      const user = await collection.findOne({ email: username });
  
      if (user) {
        const likedMedias = user.likedMedias;
  
        // Use Promise.all to fetch all liked medias concurrently
        const results = await Promise.all(
          likedMedias.map(async (likedMedia) => {
            try {
              return await Media.findOne({ _id: likedMedia }).exec();
            } catch (err) {
              console.error('Error searching for document with ObjectID', likedMedia, ':', err);
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
  

//save likes medias ID to user 
app.post('/api/saveLikedMedia/:mediaId', async (req, res) => {
    const mediaId = req.params.mediaId;
    const username = req.session.user; // Get the username from the session

    try {
        // Look up the user based on the username and update their data
        const user = await collection.findOne({ email: username });

        if (user) {
            // Check if the mediaId is already in the likedMedias array
            if (!user.likedMedias) {
                user.likedMedias = []; // Initialize likedMedias if it doesn't exist
            }

            if (!user.likedMedias.includes(mediaId)) {
                user.likedMedias.push(mediaId);

                // Update the user's likedMedias in the database
                await collection.updateOne({ email: username }, { $set: { likedMedias: user.likedMedias } });

                res.status(200).json({ message: 'Media added to liked medias.' });
            } else {
                res.status(400).json({ message: 'Media is already in liked medias.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error saving liked media:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to remove a liked media from a user's profile

app.delete('/api/removeLikedMedia/:mediaId', async (req, res) => {
    const mediaId = req.params.mediaId;
    const username = req.session.user; // Get the username from the session

    try {
        // Look up the user based on the username
        const user = await collection.findOne({ email: username });

        if (user) {
            if (!user.likedMedias) {
                user.likedMedias = [];
            }
            // Check if the mediaId is in the likedMedias array
            const index = user.likedMedias.indexOf(mediaId);
            if (index !== -1) {
                // Remove the mediaId from the likedMedias array
                user.likedMedias.splice(index, 1);
                // Update the user's likedMedias in the database
                await collection.updateOne({ email: username }, { $set: { likedMedias: user.likedMedias } });

                res.status(200).json({ message: 'Media removed from liked medias.' });
            } else {
                res.status(400).json({ message: 'Media is not in liked medias.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error removing liked media:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server on the specified port

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("PORT CONNECTED!");
})