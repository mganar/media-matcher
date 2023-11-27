// Define an empty array to store movie data
let movies = [];

let currentIndex = 0;
let likeCount = 0;
let dislikeCount = 0;
let swipeCount = 0;

function showMovieCard(movie) {
    console.log(movie); // Log the movie object for debugging

    const movieCard = document.querySelector('.movie-card');
    movieCard.querySelector('h2').textContent = movie.title;

    // Check if release_date is available
    if (movie.release_date) {
        const releaseDateElement = document.getElementById('releaseDate');
        releaseDateElement.textContent = `${movie.release_date}`;
    }

    // Check if genres are available
    if (movie.genres && movie.genres.length > 0) {
        const genresElement = document.getElementById('genres');
        genresElement.textContent = `${movie.genres.join(', ')}`;
    }

// Check if description is available
if (movie.description) {
    const overviewElement = document.getElementById('overview');
    overviewElement.textContent = `${movie.description}`;
} else {
    // If description is not available, display a placeholder
    const overviewElement = document.getElementById('overview');
    overviewElement.textContent = 'Description: N/A';
}

    movieCard.querySelector('img').src = movie.posterUrl;

    if (movie.youtube_trailer) {
        console.log('Trailer URL:', movie.youtube_trailer);
        const trailerLink = document.getElementById('trailerLink');
        trailerLink.href = movie.youtube_trailer;
    } else {
        // Hide the link if the trailer is not available
        const trailerLink = document.getElementById('trailerLink');
        trailerLink.style.display = 'none';
    }
    

}




async function fetchData() {
    const url = 'https://movies-api14.p.rapidapi.com/search?query=breaking%20bad';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '24c81b0a7amsh11e5a0d115cd66fp1247adjsn0c290c301f11',
            'X-RapidAPI-Host': 'movies-api14.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json(); // Parse response as JSON

        // Assuming the API response contains an array of movie objects, update the 'movies' array
        movies = result.contents.map((movie) => ({
            title: movie.title,
            description: movie.overview,
            posterUrl: movie.poster_path,
            release_date: movie.release_date, // Include release date
            genres: movie.genres, // Include genres
            youtube_trailer: movie.trailer_url, // Include trailer URL
            // Add more properties as needed
        }));

        // Now that 'movies' contains actual API data, you can display the first movie
        showMovieCard(movies[currentIndex]);
    } catch (error) {
        console.error(error);
    }
}


// Call the fetchData function to fetch and display movie information
fetchData();
/*
function displayMovieInfo(movies) {
    const movieInfoDiv = document.getElementById('movie-info');

    // Loop through the movies and create HTML elements to display the information
    movies.forEach((movie) => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        // Populate the movie element with data from the API response
        movieElement.innerHTML = `
            <h2>${movie.title}</h2>
            <p>Release Date: ${movie.release_date}</p>
            <p>Genres: ${movie.genres.join(', ')}</p>
            <p>Overview: ${movie.overview}</p>
            <img src="${movie.poster_path}" alt="${movie.title} Poster">
            <a href="${movie.youtube_trailer}" target="_blank">Watch Trailer</a>
        `;

        // Append the movie element to the movie-info container
        movieInfoDiv.appendChild(movieElement);
    });
}
*/

function updateSwipeCounter() {
    const swipeCounterElement = document.getElementById('swipeCounter');
    swipeCounterElement.textContent = `(${swipeCount}/10)`;
}

// Function to handle the "Like" button click
document.getElementById('likeButton').addEventListener('click', () => {
    likeCount++;
    swipeCount++;
    updateSwipeCounter();
    // Implement logic for recommending movies based on "Like"
    loadNextMovie();
});

// Function to handle the "Dislike" button click
document.getElementById('dislikeButton').addEventListener('click', () => {
    dislikeCount++;
    swipeCount++;
    updateSwipeCounter();
    // Implement logic for recommending movies based on "Dislike"
    loadNextMovie();
});

// Function to handle the "Neutral" button click
document.getElementById('neutralButton').addEventListener('click', () => {
    swipeCount++;
    updateSwipeCounter();
    // Implement logic for loading the next movie without preference update
    loadNextMovie();
});

// Function to load the next movie/TV show card
function loadNextMovie() {
    currentIndex++;
    if (currentIndex < movies.length) {
        showMovieCard(movies[currentIndex]);
    } else if (swipeCount >= 10) {
        // Redirect to another page when 10 cards have been swiped
        window.location.href = 'movie.html';
    } else {
        // Handle when all cards have been reviewed
    }
}

// Initialize the UI with the first movie card
showMovieCard(movies[currentIndex]);
updateSwipeCounter();
