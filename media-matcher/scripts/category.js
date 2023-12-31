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
 
 
 
 // Function to handle the button clicks
 function handleButtonClick(category) {
    // Update the page title
    document.getElementById("pageTitle").textContent = category;
    
    // Hide the buttonsContainer and show the subcategories and the back button
    document.getElementById("buttonsContainer").style.display = "none";
    document.getElementById("subcategories").style.display = "block";
    document.getElementById("backButton").style.display = "block";
    
    // Display subcategories based on the category
    var subcategories = [];
    if (category === "Genre") {
        subcategories = ["Action & Adventure", "Comedy", "Drama", "Sci-Fi & Fantasy", "Horror", "Animation", "War", "Family", "Documentary", "History", "Music", "Mystery",  "Crime", "Romance" ,"Thriller"];
    } 
    else if (category === "Decade Released") {
        subcategories = ["2000s", "2010s", "2020s"];
    }

        else if (category === "Content Type") {
            subcategories = ["Movies", "Shows"]
        }
    
    // Generate and display subcategory buttons
    var subcategoriesHtml = "";
    for (var i = 0; i < subcategories.length; i++) {
        subcategoriesHtml += '<button class="button subcategory-button" data-category="' + category + '">' + subcategories[i] + '</button>';
    }
    document.getElementById("subcategories").innerHTML = subcategoriesHtml;

    // Add event listeners to subcategory buttons
    var subcategoryButtons = document.querySelectorAll('#subcategories button.subcategory-button');
    subcategoryButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Handle subcategory button click
            var subcategory = this.textContent;
            var category = this.getAttribute('data-category');
            navigateToCardPage(category, subcategory);
        });
    });


}

// Function to navigate to the card.html page with parameters
function navigateToCardPage(category, subcategory) {
    var url = `home.html?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`;
    window.location.href = url;
}



// Function to handle the back button click
document.getElementById("backButton").addEventListener("click", function () {
    // Show the buttonsContainer and hide the subcategories and the back button
    document.getElementById("buttonsContainer").style.display = "block";
    document.getElementById("subcategories").style.display = "none";
    document.getElementById("backButton").style.display = "none";
    
    // Reset the page title
    document.getElementById("pageTitle").textContent = "Media Matcher";
});

// Add event listeners to the category buttons
document.getElementById("genreButton").addEventListener("click", function () {
    handleButtonClick("Genre");
});

document.getElementById("decadeButton").addEventListener("click", function () {
    handleButtonClick("Decade Released");
});

document.getElementById("contentTypeButton").addEventListener("click", function () {
    handleButtonClick("Content Type");
});