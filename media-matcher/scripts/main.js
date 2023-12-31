// Sample media data (you would fetch this data from your back end)
let medias = [];
let currentIndex = 0;
const likeList = [];
// Get category and subcategory parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category");
const selectedSubcategory = urlParams.get("subcategory");



// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fetch the media data from the JSON file
fetch('/api/medias')
    .then(response => response.json())
    .then(data => {
        medias = data;
        // Now, you can work with the 'medias' array to display the medias.
        shuffleArray(medias); // Shuffle the medias array
        showMedia(currentIndex, selectedCategory, selectedSubcategory);
       
    })
    .catch(error => {
        console.error('Error fetching media data:', error);
    });
   

    
    function showMedia(index, selectedCategory, selectedSubcategory) {
        console.log("Showing media at index:", index);
    
        const mediaCard = document.querySelector("#mediaCard"); // Use ID selector
    
        if (index < 0 || index >= medias.length) {
            console.log("Index out of bounds.");
            mediaCard.innerHTML = "No more medias to display.";
            return;
        }
    
        const media = medias[index];
      
      
      
        if (selectedCategory === "Genre") {
            if (!media.genres.includes(selectedSubcategory)) {
                currentIndex++;
                showMedia(currentIndex, selectedCategory, selectedSubcategory);
                return;
            }
        } else if (selectedCategory === "Decade Released") {
            // Extract the first three characters of the release year (e.g., "20" for 2023)
            const releaseYearPrefix = media.release_date.slice(0, 3);
        
            if (releaseYearPrefix !== selectedSubcategory.slice(0, 3)) {
                currentIndex++;
                showMedia(currentIndex, selectedCategory, selectedSubcategory);
                return;
            }
        }   else if (selectedCategory === "Content Type") {
            if (selectedSubcategory === "Movies" && media.contentType !== "movie") {
                currentIndex++;
                showMedia(currentIndex, selectedCategory, selectedSubcategory);
                return;
            } else if (selectedSubcategory === "Shows" && media.contentType !== "show") {
                currentIndex++;
                showMedia(currentIndex, selectedCategory, selectedSubcategory);
                return;
            }
        }

          console.log("Media:", media);
          // Update the media card elements with the current media's data
          mediaCard.querySelector("h2").textContent = media.title;
          const releaseDate = new Date(media.release_date);
          const formattedReleaseDate = releaseDate.toLocaleDateString(); // Adjust options as needed
          mediaCard.querySelector(".release-date").textContent = formattedReleaseDate;
          mediaCard.querySelector(".overview").textContent = media.overview;
          mediaCard.querySelector("img").src = media.poster_path;
          mediaCard.querySelector(".media-genres").textContent = media.genres;
          mediaCard.querySelector(".content-type").textContent = media.contentType;
      
          // Assuming you have a content type element in your HTML
          // Update the content type element with the current media's data
          const contentTypeElement = document.querySelector("#contentType");
          if (contentTypeElement) {
              contentTypeElement.textContent = "Content Type: " + media.contentType;
          }
      }
 


// Function to handle the "dislike" action
function dislikeMedia() {
    currentIndex++;
    showMedia(currentIndex, selectedCategory, selectedSubcategory);
}

// Event listener for the like button
document.querySelector(".like-button").addEventListener("click", () => {
    const currentMedia = medias[currentIndex];

    if (currentMedia) {
        // Assuming currentMedia._id is a valid ObjectId
        const likedMediaID = currentMedia._id;
        console.log(likedMediaID);
        saveLikedMedia(likedMediaID)
    }
    currentIndex++;
    showMedia(currentIndex, selectedCategory, selectedSubcategory);
});

// Event listener for the dislike button
document.querySelector(".dislike-button").addEventListener("click", () => {
    const currentMedia = medias[currentIndex];

    if (currentMedia) {
        // Assuming currentMedia._id is a valid ObjectId
        const likedMediaID = currentMedia._id;
        console.log(likedMediaID);
  
    }
    currentIndex++;
    showMedia(currentIndex, selectedCategory, selectedSubcategory);
});


// Function to toggle the dropdown menu
function toggleDropdownMenu() {
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

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




