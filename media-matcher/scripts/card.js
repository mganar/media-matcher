// Sample media data (you would fetch this data from your back end)
let medias = [];
let currentIndex = 0;
const likeList = [];
let swipeCount = 0;


// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fetch the media data from the JSON file and shuffle it
fetch('/api/medias')
  .then(response => response.json())
  .then(data => {
      medias = data;
      // Shuffle the medias array
      shuffleArray(medias);
      // Now, you can work with the shuffled 'medias' array to display the medias.
      showMedia(currentIndex);
  })
  .catch(error => {
      console.error('Error fetching media data:', error);
  });

   
    function showMedia(index) {
      console.log("Showing media at index:", index);
  
      const mediaCard = document.querySelector("#mediaCard"); // Use ID selector
  
      if (index < 0 || index >= medias.length) {
          console.log("Index out of bounds.");
          mediaCard.innerHTML = "No more medias to display.";
          return;
      }
  
      const media = medias[index];
  
      console.log("Media:", media);
      // Update the media card elements with the current media's data
      mediaCard.querySelector("h2").textContent = media.title;
      mediaCard.querySelector("p#overview").textContent = "Overview: " + media.overview;
     // Modify to remove time part
// Modify to format as "m-d-y"
const releaseDate = new Date(media.release_date);
const formattedDate = `${releaseDate.getMonth() + 1}-${releaseDate.getDate()}-${releaseDate.getFullYear()}`;
mediaCard.querySelector("p#releaseDate").textContent = "Release Date: " + formattedDate;
      mediaCard.querySelector("p#genres").textContent = "Genres: " + media.genres.join(", ");
      mediaCard.querySelector("img").src = media.poster_path;
  
      // Assuming you have a content type element in your HTML
      // Update the content type element with the current media's data
      const contentTypeElement = document.querySelector("#contentType");
      if (contentTypeElement) {
          contentTypeElement.textContent = "Content Type: " + media.contentType;
      }
  }
  
  
 
// Function to toggle the dropdown menu
function toggleDropdownMenu() {
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

// Function to handle the "dislike" action
function dislikeMedia() {
    currentIndex++;
    showMedia(currentIndex);
}

// Function to redirect to the next page if currentIndex reaches 25
function redirectToNextPage() {
  if (currentIndex === 25) {
      // Redirect to the next page (replace 'nextPage.html' with the actual URL)
      window.location.href = 'movie.html';
  }
}

// Event listener for the like button
document.querySelector("#likeButton").addEventListener("click", () => {
  currentIndex++;
  showMedia(currentIndex);
  updateSwipeCounter();

  const currentMedia = medias[currentIndex];

  if (currentMedia) {
      // Assuming currentMedia._id is a valid ObjectId
      const likedMediaID = currentMedia._id;
      console.log(likedMediaID);
      saveLikedMedia(likedMediaID);
  }

  // Check and redirect to the next page
  redirectToNextPage();
});

// Event listener for the dislike button
document.querySelector("#dislikeButton").addEventListener("click", () => {
  currentIndex++;
  showMedia(currentIndex);
  updateSwipeCounter();

  const currentMedia = medias[currentIndex];

  if (currentMedia) {
      // Assuming currentMedia._id is a valid ObjectId
      const likedMediaID = currentMedia._id;
      console.log(likedMediaID);
      removeLikedMedia(likedMediaID);
  }

  // Check and redirect to the next page
  redirectToNextPage();
});

// Function to update the swipe counter in the HTML
function updateSwipeCounter() {
  document.querySelector("#swipeCounter").textContent = `(${currentIndex}/25)`;
}

// Call the initial update of the swipe counter
updateSwipeCounter();


// Event listener for the dropdown button
const dropdownButton = document.querySelector(".dropdown-button");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownButton.addEventListener("click", toggleDropdownMenu);

// Function to save a liked media to the user's profile
function saveLikedMedia(mediaId) {
    // You can use JavaScript fetch or another method to make the request
    fetch(`/api/saveLikedMedia/${mediaId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.status === 200) {
            // Update the UI to indicate that the media has been liked
            console.log('Saving liked media'); // Disable the button, for example
        } else {
            console.error('Error saving liked media');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}


// Function to remove a liked media from the user's profile
function removeLikedMedia(mediaId) {
    // You can use JavaScript fetch or another method to make the request
    fetch(`/api/removeLikedMedia/${mediaId}`, {
        method: 'DELETE',
    })

    .then(response => {
        if (response.status === 200) {
            // Update the UI to indicate that the media has been liked
            console.log('Removing liked media'); // Disable the button, for example
        } else {
            console.error('Error saving liked media');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}




