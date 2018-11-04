if (document.querySelector("#submit") != null){
    window.onload = (e) => {document.querySelector("#submit").onclick = getData};
}
//else if (document.querySelectorAll())
	
let displayTitle = "";
let displayYear = "";
const SEARCH_URL = "index.html";
const RESTULTS_URL = "results.html";
const MOVIE_URL = "movie.html";

function getData(){
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

    if(title.length < 1) return;

    while (title.includes("%20")){
        title = title.replace("%20","+");
    }

    if (year.length < 1){
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

function jsonLoaded(obj){
    console.log("obj = " + obj);
    console.log("obj stringified = " + JSON.stringify(obj));

    window.open(RESTULTS_URL, "_self");

    if (!obj.data || obj.data.length == 0){
        let noResults = document.createElement(p);
        noResults.innerHTML = `<i>No Results Found for '${displayTerm}'</i>`
        document.querySelector("main").appendChild(noResults);
    }
}