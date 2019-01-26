require("dotenv").config();
var keys = require("./keys.js");
var moment = require('moment');
var fs = require("fs");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the search query
var searchQuery = "";

// Loop through all the words in the node argument
for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {
    searchQuery = searchQuery + " " + nodeArgs[i];
  } else {
    searchQuery += nodeArgs[i];

  }
}

function concertThis() {
  axios.get("https://rest.bandsintown.com/artists/" + searchQuery + "/events?app_id=codingbootcamp").then(
    function (response) {
      formatDate = moment(response.data[0].datetime).format("MM/DD/YYYY");
      console.log("Venue name: " + response.data[0].venue.name);
      console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country);
      console.log(formatDate);
    }).catch(function (err) {
    console.log(err);
  })

};

// Then run a request to the Spotify API with the song title specified
function spotifyThisSong() {
  if (!process.argv[3]) {
    spotify.search({
        type: 'track',
        query: 'ace of base'
      }).then(function (response) {
        console.log("Artist: " + response.tracks.items[0].artists[0].name);
        console.log("Song: " + response.tracks.items[0].name);
        console.log("Preview: " + response.tracks.items[0].preview_url);
        console.log("Album: " + response.tracks.items[0].album.name);
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    spotify.search({
        type: 'track',
        query: searchQuery
      }).then(function (response) {
        console.log("Artist: " + response.tracks.items[0].artists[0].name);
        console.log("Song: " + response.tracks.items[0].name);
        console.log("Preview: " + response.tracks.items[0].preview_url);
        console.log("Album: " + response.tracks.items[0].album.name);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
};

// Run a request with axios to the OMDB API with the movie specified
if (!process.argv[3]) {
  function movieThis() {
    axios.get("http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&tomatoes=true&r=json&apikey=trilogy").then(
      function (response) {
        console.log("Title: " + response.data.Title);
        console.log("Released: " + response.data.Year);
        console.log("IMDB rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Produced in: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      }
    );
  }
} else {
  function movieThis() {
    axios.get("http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&tomatoes=true&r=json&apikey=trilogy").then(
      function (response) {
        console.log("Title: " + response.data.Title);
        console.log("Released: " + response.data.Year);
        console.log("IMDB rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Produced in: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      }
    );
  };
}



function rando() {
  fs.readFile("./random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    } else {
      splitData = data.split(",");
      console.log(splitData[0]);
      console.log(splitData[1]);
    }
  });
}


var action = process.argv[2]


switch (action) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    rando();
    break;
}