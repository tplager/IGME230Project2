window.onload = setEvents;

function setEvents() {
    if (document.querySelector("#submit") != null) {
        document.querySelector("#submit").onclick = getData;
    }
    else if (document.querySelector("#resultsTitle") != null) {
        document.querySelector("#searchPage").onclick = goToSearch;
        resultsLoaded();
    }
    if (document.querySelector("#movieTitle") != null) {
        document.querySelector("#resultsPage").onclick = goToResults;
        document.querySelector("#searchPage").onclick = goToSearch;
        getMovieData();
    }
}

let displayTerm = "";
let displayYear = "";
const SEARCH_URL = "index.html";
const RESULTS_URL = "results.html";
const MOVIE_URL = "movie.html";

function getData() {
    const OMDB_URL = "http://www.omdbapi.com/?apikey=fbf8855f&";

    url = OMDB_URL;

    let title = document.querySelector("#titleSearch").value;
    displayTerm = title;

    let year = document.querySelector("#yearSearch").value;
    displayYear = year;

    title = title.trim();
    title = encodeURIComponent(title);
    year = year.trim()
    year = encodeURIComponent(year);

    if (title.length < 1) return;

    while (title.includes("%20")) {
        title = title.replace("%20", "+");
    }

    if (year.length < 1) {
        url += "s=" + title;
    }
    else {
        url += "s=" + title + "&y=" + year;
    }

    console.log(url);

    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: jsonLoaded
    });
}

function jsonLoaded(obj) {
    let listID = "tlp6760-movie-list";
    let items = JSON.stringify(obj);
    localStorage.setItem(listID, items);

    let termID = "tlp6760-term";
    localStorage.setItem(termID, displayTerm);

    window.open(RESULTS_URL, "_self");
}

function resultsLoaded() {
    let listID = "tlp6760-movie-list";
    let obj = localStorage.getItem(listID);
    obj = JSON.parse(obj);

    let titleID = "tlp6760-term";
    displayTerm = localStorage.getItem(titleID);

    console.log("obj = " + obj);
    console.log("obj stringified = " + JSON.stringify(obj));

    if (obj.Response == "False") {
        document.querySelector(".container").innerHTML = `<p><i>No Results Found for '${displayTerm}'</i></p>`;
        return;
    }

    let results = obj.Search;
    console.log("results.length = " + results.length);
    document.querySelector(".container").innerHTML = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

    let bigString = "";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let posterURL = result.Poster;
        if (!posterURL) posterURL = "media/no-image-found.png";
        let title = result.Title;

        let line = `<div class = 'result' title = '${title}'><img src = '${posterURL}' title = '${title}' />`;
        line += `<span><p>'${title}'</p></span></div>`;

        bigString += line;
    }

    document.querySelector(".container").innerHTML += bigString;

    let movieResults = document.querySelectorAll(".result");
    for (let i = 0; i < movieResults.length; i++) {
        movieResults[i].onclick = goToMovie;
    }
}

function getMovieData() {
    const OMDB_URL = "http://www.omdbapi.com/?apikey=fbf8855f&";

    url = OMDB_URL;

    let titleID = "tlp6760-movie-title";
    let title = localStorage.getItem(titleID);

    title = title.trim();
    title = encodeURIComponent(title);

    //if(title.length < 1) return;

    while (title.includes("%20")) {
        title = title.replace("%20", "+");
    }

    url += "t=" + title + "&plot=full";

    console.log(url);

    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: loadMovie
    });
}

function loadMovie(obj) {
    console.log("obj = " + obj);
    console.log("obj stringified = " + JSON.stringify(obj));

    document.querySelector("#movieTitle").innerHTML = obj.Title;

    let main = document.querySelector(".container");

    let img = document.createElement("img");
    img.src = obj.Poster;
    img.className = "poster";
    
    // Image styling
    img.style.cssFloat = "right";
    //img.style.display = "block";
    //img.style.width = "300px";
    //img.style.margin = "auto";

    main.appendChild(img);
    if (obj.Ratings.length > 1) {

        // Creating ratings header
        let ratingsTitle = document.createElement("h3");
        ratingsTitle.innerHTML = "Ratings";
        main.appendChild(ratingsTitle);

        // Ratings title styling
       // ratingsTitle.style.paddingLeft = "400px";

        // Creating the list of ratings
        let ratings = document.createElement("ul");
        ratings.className = "list-group w-25";

        // Adding ratings to the list
        let rottenTomatoes = document.createElement("li");
        rottenTomatoes.className = "list-group-item";
        rottenTomatoes.innerHTML = "Rotten Tomatoes: " + obj.Ratings[1].Value;

        let imdb = document.createElement("li");
        imdb.className = "list-group-item";
        imdb.innerHTML = "IMDb: " + obj.Ratings[0].Value;

        let metacritic = document.createElement("li");
        metacritic.innerHTML = "Metacritic: " + obj.Ratings[2].Value;
        metacritic.className = "list-group-item";

        // Appending children to ratings list
        ratings.appendChild(rottenTomatoes);
        ratings.appendChild(imdb);
        ratings.appendChild(metacritic);
        main.appendChild(ratings);

        // Ratings styling
        //ratings.style.paddingLeft = "400px";
    }
    else {
        let ratingsTitle = document.createElement("h3");
        ratingsTitle.innerHTML = "Rating";
        main.appendChild(ratingsTitle);

        let ratings = document.createElement("ul");
        let imdb = document.createElement("li");
        imdb.innerHTML = "IMDb: " + obj.Ratings[0].Value;
        ratings.appendChild(imdb);
        main.appendChild(ratings);
    }

    let description = document.createElement("aside");
    description.id = "plot";
    description.innerHTML = obj.Plot;

    main.appendChild(description);

    // Description styling
    //description.style.width = "400px";
    //description.style.cssFloat = "right";
    //description.style.marginRight = "30px";
    description.style.border = "solid";

    let info = document.createElement("section");
    info.className = "row";

    let esrbRating = document.createElement("li");
    esrbRating.className = "col";
    esrbRating.innerHTML = obj.Rated;
    info.appendChild(esrbRating);

    let releaseYear = document.createElement("li");
    releaseYear.className = "col";
    releaseYear.innerHTML = obj.Year;
    info.appendChild(releaseYear);

    let spacer = document.createElement("div");
    spacer.className = "w-100";
    info.appendChild(spacer);

    let runtime = document.createElement("li");
    runtime.className = "col";
    info.appendChild(runtime);
    runtime.innerHTML = obj.Runtime;

    if (obj.Production != null) {

        let studio = document.createElement("li");
        studio.className = "col";
        studio.innerHTML = obj.Production;
        info.appendChild(studio);
    }
    else {
        info.appendChild(esrbRating);
        info.appendChild(releaseYear);
        info.appendChild(runtime);
    }

    main.appendChild(info);
}

function goToSearch() {
    window.open(SEARCH_URL, "_self");
}

function goToResults() {
    window.open(RESULTS_URL, "_self");
}

function goToMovie() {
    let title = this.title;

    let titleID = "tlp6760-movie-title";
    localStorage.setItem(titleID, title);

    window.open(MOVIE_URL, "_self");
}