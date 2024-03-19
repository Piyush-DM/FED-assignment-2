// Spotify API credentials
const clientId = '08b02b8351a54205b7e5615e4cdf4435'; // Replace with your Spotify client ID
const clientSecret = '58e3602ff35040b393d3bc2c9ac92a47'; // Replace with your Spotify client secret

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

// Event listener for the search button
searchBtn.addEventListener('click', search);

// Function to handle search functionality
async function search() {
    const query = searchInput.value;
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        headers: {
            'Authorization': 'Bearer ' + await getToken()
        }
    });
    const data = await response.json();
    displaySearchResults(data);
}

// Function to display search results
function displaySearchResults(data) {
    searchResults.innerHTML = ''; // Clear previous search results
    if (data && data.tracks && data.tracks.items && data.tracks.items.length > 0) {
        // Loop through each track item and create list item
        data.tracks.items.forEach(track => {
            const li = createListItem(track.name, track.album.images.length > 0 ? track.album.images[0].url : '', track.preview_url);
            searchResults.appendChild(li);
        });
    } else {
        // If no results found, display a message
        const li = document.createElement('li');
        li.textContent = 'No results found';
        searchResults.appendChild(li);
    }
}

// Function to create a list item for each search result
function createListItem(name, imageUrl, previewUrl) {
    const li = document.createElement('li');
    li.classList.add('search-item');

    // Create span for track name
    const span = document.createElement('span');
    span.textContent = name;
    li.appendChild(span);

    // Create img tag for track image
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Image';
        img.classList.add('search-image');
        li.appendChild(img);
    }

    // Create audio tag for track preview
    if (previewUrl) {
        const audio = new Audio(previewUrl);
        audio.controls = true; // Enable audio controls
        li.appendChild(audio);
    }

    return li;
}

// Function to fetch access token from Spotify API
async function getToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret
