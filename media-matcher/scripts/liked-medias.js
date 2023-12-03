function displayLikedMedias() {
    const likedMediasList = document.querySelector('.liked-media-card');
    likedMediasList.innerHTML = ''; // Clear the list

    likedMedias.forEach((media, index) => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');

        const genres = media.genres.join(', ');
        const releaseDate = new Date(media.release_date);
        const formattedReleaseDate = releaseDate.toLocaleDateString(); // Adjust options as needed
        
        mediaCard.innerHTML = `
            <img src="${media.poster_path}" alt="${media.title}">
            <h2>${media.title}</h2>
            <p>${media.overview}</p>
            <p>Release Date: ${formattedReleaseDate}</p>
            <p>Genres: <span class="media-genres">${genres}</span></p>
            <p>Content Type: <span class="content-type">${media.contentType}</span></p>
            <button class="remove-button">Remove</button>
        `;

        const removeButton = mediaCard.querySelector(".remove-button");
        removeButton.addEventListener("click", () => {
            removeMedia(index);
        });

        likedMediasList.appendChild(mediaCard);
    });
}

// Function to save the liked medias to local storage

function fetchLikedMediasData() {
    fetch('/likedMedias')
        .then(response => response.json())
        .then(data => {
            likedMedias = data
            console.log(likedMedias)
            displayLikedMedias(likedMedias);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
// Function to remove a liked media

function removeMedia(index) {
    console.log(index)
    if (index >= 0 && index < likedMedias.length) {
        const likedMediaID = likedMedias[index]._id;
        removeLikedMedia(likedMediaID)
        likedMedias.splice(index, 1); // Remove the media from the likedMedias array
        
        displayLikedMedias(); // Update the displayed liked medias
    }
}


function removeLikedMedia(mediaId) {
    // You can use JavaScript fetch or another method to make the request
    fetch(`/api/removeLikedMedia/${mediaId}`, {
        method: 'DELETE',
    })

    .then(response => {
        if (response.status === 200) {
            // Update the UI to indicate that the media has been liked
            console.log('Removing liked media'); 
        } else {
            console.error('Error saving liked media');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}


// Call the function to display liked medias when the page loads
fetchLikedMediasData();
displayLikedMedias();

dropdownButton.addEventListener("click", toggleDropdownMenu);

