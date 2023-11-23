// Sample movie data (replace with actual API data)
const movies = [
    { title: "Movie 1", description: "Description 1", posterUrl: "poster1.jpg" },
    { title: "Movie 2", description: "Description 2", posterUrl: "poster2.jpg" },
    // Add more movie objects
];

let currentIndex = 0;
let likeCount = 0;
let dislikeCount = 0;
let swipeCount = 0;

// Function to display the current movie/TV show card
function showMovieCard(index) {
    const movie = movies[index];
    const movieCard = document.querySelector('.movie-card');
    movieCard.querySelector('h2').textContent = movie.title;
    movieCard.querySelector('p').textContent = movie.description;
    movieCard.querySelector('img').src = movie.posterUrl;
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
        showMovieCard(currentIndex);
    } else if (swipeCount >= 10) {
        // Redirect to another page when 10 cards have been swiped
        window.location.href = 'movie.html';
    } else {
        // Handle when all cards have been reviewed
    }
}
// Function to update the swipe counter
function updateSwipeCounter() {
    document.getElementById('swipeCounter').textContent = `(${swipeCount}/10)`;
}

// Initialize the UI with the first movie card
showMovieCard(currentIndex);
updateSwipeCounter();
