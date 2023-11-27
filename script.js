const url = 'https://movies-api14.p.rapidapi.com/home';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '24c81b0a7amsh11e5a0d115cd66fp1247adjsn0c290c301f11',
    'X-RapidAPI-Host': 'movies-api14.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await fetch(url, options);
    const data = await response.json(); // Parse the response as JSON

    const movieDataDiv = document.getElementById('movie-data');

    // Iterate through each category
    for (const category of data) {
      const categoryTitleElement = document.createElement('h1');
      categoryTitleElement.textContent = category.title;
      movieDataDiv.appendChild(categoryTitleElement);

      // Iterate through the movies in this category
      for (const movie of category.movies) {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        // Create an <img> element for the movie poster
        const posterElement = document.createElement('img');
        posterElement.src = movie.poster_path;
        posterElement.alt = `${movie.title} Poster`;

        // Create HTML elements for the movie information
        const titleElement = document.createElement('h2');
        titleElement.textContent = movie.title;

        const genresElement = document.createElement('p');
        genresElement.textContent = `Genres: ${movie.genres.join(', ')}`;

        const overviewElement = document.createElement('p');
        overviewElement.textContent = `Overview: ${movie.overview}`;

        const releaseDateElement = document.createElement('p');
        releaseDateElement.textContent = `Release Date: ${movie.release_date}`;

        // Append the movie poster and other information to the movie element
        movieElement.appendChild(posterElement);
        movieElement.appendChild(titleElement);
        movieElement.appendChild(genresElement);
        movieElement.appendChild(overviewElement);
        movieElement.appendChild(releaseDateElement);

        // Append the movie element to the main container
        movieDataDiv.appendChild(movieElement);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

fetchData(); // Call the async function to start the data fetching process
