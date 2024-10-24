const searchBar = document.getElementById('movie-search-bar')
let moviesList = document.getElementById('movies-list')
const form = document.getElementById('movie-input')
let watchlistedMovies = []
const localStorageLeads = JSON.parse(localStorage.getItem("watchlist-movies"))

if(localStorageLeads){
    watchlistedMovies = localStorageLeads
}

form.addEventListener('submit', fetchMovies)

async function fetchMovies(e){
    e.preventDefault()
    moviesList.innerHTML = `<div class="loader"></div>`
    const moviesAPIData = await getDataFromAPI()
    let moviesHTML = ""
    for(let movieAPIData of moviesAPIData){
        const movieData = await getMoviesData(movieAPIData)
        moviesHTML += addToHtml(movieData)
    }
    moviesList.innerHTML = moviesHTML
}

async function getDataFromAPI(){
    let response = await fetch(`https://www.omdbapi.com/?s=${searchBar.value}&apikey=940211cb`)
    let data = await response.json()
    if(data.Response == 'False'){
        renderAplology()
        return
    }
    return data.Search
}

async function getMoviesData(movieAPIData){
    const response =  await fetch(`https://www.omdbapi.com/?i=${movieAPIData.imdbID}&apikey=940211cb`)
    const movieData = await response.json()
    return movieData
}


function addToHtml(movieData){
    if(watchlistedMovies.includes(movieData.imdbID)){
        return savedMovie(movieData)
    }
    else{
        return unsavedMovie(movieData)
    }
}

function savedMovie(movieData){
    const {Poster, Title, imdbRating, Year, Genre, Plot, imdbID} = movieData
    return `
    <div class="movie">
        <img src=${Poster} alt="" class="movie-pic">
        <div class="first-line">
            <h4 class="movie-title">${Title}
            </h4>
            <div class="rating-div">
                <img src="./img/star.png" alt="star-img" class="rating-img">
                <p class="rating">${imdbRating}</p>
            </div>
        </div>
        <div class="second-line">
            <p class="release-year">${Year}</p>
            <p class="genres">${Genre}</p>
            <div class="add-to-watchlist" id=${imdbID}-add-div>
                <i class="fa-sharp fa-solid fa-circle-check green"></i>
                <p class="green">saved</p>
            </div>
        </div>
        <div class="about-movie">
            <p>${Plot}</p>
        </div>
    </div>`
}

function unsavedMovie(movieData){
    const {Poster, Title, imdbRating, Year, Genre, Plot, imdbID} = movieData
    return `
    <div class="movie">
        <img src=${Poster} alt="" class="movie-pic">
        <div class="first-line">
            <h4 class="movie-title">${Title}
            </h4>
            <div class="rating-div">
                <img src="./img/star.png" alt="star-img" class="rating-img">
                <p class="rating">${imdbRating}</p>
            </div>
        </div>
        <div class="second-line">
            <p class="release-year">${Year}</p>
            <p class="genres">${Genre}</p>
            <div class="add-to-watchlist" id=${imdbID}-add-div>
                <i class="fa-solid fa-circle-plus" data-add=${imdbID}></i>
                <p data-add=${imdbID}>Watchlist</p>
            </div>
        </div>
        <div class="about-movie">
            <p>${Plot}</p>
        </div>
    </div>`
}

function renderAplology(){
    moviesList.innerHTML = `
    <h3 class="gray-font">Unable to find what you’re looking for.</h3>
    <h3 class="gray-font">Please try another search.</h3>`
}

document.addEventListener('click', (e)=>{
    if(e.target.dataset.add){
        addToWatchlist(e.target.dataset.add)
    }
})

function addToWatchlist(imdbID){
    watchlistedMovies.push(imdbID)
    localStorage.setItem("watchlist-movies", JSON.stringify(watchlistedMovies))
    savedHtml(imdbID)
}

function savedHtml(imdbID){
    document.getElementById(`${imdbID}-add-div`).innerHTML = `
    <i class="fa-sharp fa-solid fa-circle-check green"></i>
    <p class="green">saved</p>`
}