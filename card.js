    // Define an empty array to store movie data
    let movies = [];
    let likedMovies = [];
    let currentIndex = 1; // Start at 1
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
        const url = 'https://movies-api14.p.rapidapi.com/home';
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
            const data = await response.json(); // Parse response as JSON
    
            // Assuming the API response contains an array of movie objects, update the 'movies' array
            movies = data[0].movies.map((movie) => ({
                title: movie.title,
                description: movie.overview,
                posterUrl: movie.poster_path,
                release_date: movie.release_date, // Include release date
                genres: movie.genres, // Include genres
                youtube_trailer: movie.trailer_url, // Include trailer URL
                // Add more properties as needed
            }));
    
            // Retrieve category and subcategory from query parameters
            const params = new URLSearchParams(window.location.search);
            const category = params.get('category');
            const subcategory = params.get('subcategory');
    
            // Filter movies based on category and subcategory
            if (category && subcategory) {
                movies = movies.filter((movie) => {
                    if (category === 'Genre') {
                        return movie.genres && movie.genres.includes(subcategory);
                    } else if (category === 'Decade Released') {
                        // Assuming the subcategory is a decade (e.g., '1970s')
                        return movie.release_date && movie.release_date.startsWith(subcategory);
                    } else if (category === 'Language') {
                        // Assuming the subcategory matches the language (e.g., 'English')
                        return movie.language === subcategory;
                    } else if (category === 'Award-Winning') {
                        // Add logic to filter based on awards if available
                        return false; // Example: return movie.awards === subcategory;
                    }
                });
            }
    
            // Now that 'movies' contains filtered data, you can display the first movie
            showMovieCard(movies[currentIndex]);
        } catch (error) {
            console.error(error);
        }
    }
    
    // Call the fetchData function to fetch and display movie information
    fetchData();
    
    function updateSwipeCounter() {
        const swipeCounterElement = document.getElementById('swipeCounter');
        swipeCounterElement.textContent = `(${swipeCount}/10)`;
    }
    
    document.getElementById('likeButton').addEventListener('click', () => {
        console.log('like');
        const currentMovie = movies[currentIndex];
        likedMovies.push(currentMovie);
        swipeCount++;
        updateSwipeCounter();
        loadNextMovie();
    });
    
    document.getElementById('dislikeButton').addEventListener('click', () => {
        console.log('dislike');
        swipeCount++;
        updateSwipeCounter();
        loadNextMovie();
    });
    

    function loadNextMovie() {
        currentIndex++;
    
        if (swipeCount === 10) {
            // Store liked movies in local storage
            localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
            window.location.href = 'movie.html';
        } else if (currentIndex < movies.length) {
            showMovieCard(movies[currentIndex]);
        } else {
            // Handle when all cards have been reviewed
        }
    }
    
    // Initialize the UI with the first movie card
    showMovieCard(movies[currentIndex]);
    updateSwipeCounter();