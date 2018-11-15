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
    const OMDB_URL = "https://www.omdbapi.com/?apikey=fbf8855f&";

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

    //let bigString = "";
    let section = document.createElement("div");
    section.className = "row";

    let section2 = document.createElement("div");
    section2.className = "row";

    for (let i = 0; i < results.length; i++) {

        let result = results[i];

        let posterURL = result.Poster;
        if (!posterURL) posterURL = "media/no-image-found.png";
        let title = result.Title;

        let line = `<div class = 'result col-sm-2' title = '${title}'><img src = '${posterURL}' title = '${title}' />`;
        line += `<span><p>'${title}'</p></span></div>`;

        if (i >= 0 && i < 5) {
            section.innerHTML += line;
        }
        else if (i >= 5 && i < 10) {
            section2.innerHTML += line;
        } 
        //bigString += line;
    }
    document.querySelector(".container").appendChild(section);
    document.querySelector(".container").appendChild(section2);

    let movieResults = document.querySelectorAll(".result");
    for (let i = 0; i < movieResults.length; i++) {
        movieResults[i].onclick = goToMovie;
    }
}

function getMovieData() {
    const OMDB_URL = "https://www.omdbapi.com/?apikey=fbf8855f&";

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
    img.style.display = "block";

    main.appendChild(img);
    if (obj.Ratings.length > 1) {

        // Creating ratings header
        let ratingsTitle = document.createElement("h3");
        ratingsTitle.innerHTML = "Ratings";
        main.appendChild(ratingsTitle);

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
    description.style.width = "600px";
    description.style.border = "1px solid";
    description.style.borderColor = "rgba(0,0,0,0.125)";
    description.style.borderRadius = ".25rem";
    description.style.backgroundColor = "#FFF";
    description.style.marginTop = "5px";
    description.style.marginBottom = "5px";
    description.style.padding = "5px";

    let info = document.createElement("section");
    info.className = "row";
    info.style.border = "1px solid";
    info.style.borderColor = "rgba(0,0,0,0.125)";
    info.style.borderRadius = ".25rem";
    info.style.backgroundColor = "#FFF";
    info.style.width = "600px";
    info.style.margin = "0";
    info.style.padding = "5px";

    let esrbRating = document.createElement("p");
    esrbRating.className = "col";
    esrbRating.innerHTML = "<u>ESRB</u>: " + obj.Rated;
    info.appendChild(esrbRating);

    let releaseYear = document.createElement("p");
    releaseYear.className = "col";
    releaseYear.innerHTML = "<u>Release Date</u>: " + obj.Year;
    info.appendChild(releaseYear);

    let spacer = document.createElement("div");
    spacer.className = "w-100";
    info.appendChild(spacer);

    let runtime = document.createElement("p");
    runtime.className = "col";
    info.appendChild(runtime);
    runtime.innerHTML = "<u>Runtime</u>: " + obj.Runtime;

    if (obj.Production != null) {

        let studio = document.createElement("p");
        studio.className = "col";
        studio.innerHTML = "<u>Studio</u>: " + obj.Production;
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