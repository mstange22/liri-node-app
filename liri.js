const keys = require("./keys");

var Twitter = require("twitter");
	 
var twitterClient = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.token_key,
  access_token_secret: keys.twitterKeys.token_secret,
});
 
var twitterParams = {screen_name: "Mike_Bootcamp"};


var Spotify = require("node-spotify-api");
 
var spotify = new Spotify({
	id: keys.spotifyKeys.client_id,
	secret: keys.spotifyKeys.client_secret
});

var defaultTrack = "The Sign";
var defaultArtist = "Ace of Base";
var spotifySearch;

var request = require("request");

var defaultMovie = "Mr. Nobody";
var movieSearch;
var movieQueryURL;
var parsedResponse;

var fs = require("fs");
var incomingData = [];

if(process.argv[2] === "do-what-it-says") {

	// open random.txt
	fs.readFile(process.cwd()+"\\random.txt", function(error,data) {

        if(error) {

            return console.log(error)
        }

        else {

        	incomingData = data.toString().split(",");

			process.argv[2] = incomingData[0];
			process.argv[3] = incomingData[1];

			// console.log(process.argv[2], process.argv[3]);
			doStuff();
        }
    });
}

function doStuff() {

	// twitter
	if(process.argv[2] === "my-tweets") {

		// show last 20 tweets
		twitterClient.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {

		 	if (!error) {

		 		for(var i = 0; i < tweets.length && i < 20; i++) {
				
					console.log(tweets[i].text);
				}
			}

		 	else {

		 		console.log(JSON.stringify(error));
		 	}

		});
	}

	// spotify
	if(process.argv[2] === "spotify-this-song") {

		if(process.argv[3]) {

			spotifySearch = process.argv[3];
		}

		else {

			spotifySearch = defaultTrack;
		}

		// console.log(spotifySearch);

		spotify.search({ type: 'track', query: spotifySearch, limit: 1 }, function(error, data) {
	 
	 		if (error) {

	 			return console.log('Error occurred: ' + error);
	 		}

			// loop through "items" array...
			for(i = 0; i < data.tracks.items.length; i++) {

				console.log("Track #" + (i + 1));

				// ...then through artist(s)
				for(j = 0; j < data.tracks.items[i].artists.length; j++) {

					console.log("Artist(s): " + data.tracks.items[i].artists[j].name);		
				}

				// song title
				console.log("Title: " + data.tracks.items[i].name);

				// preview link
				console.log("Spotify Preview Link: " + data.tracks.items[i].preview_url);

				// album name
				console.log("Album: " + data.tracks.items[i].album.name);

				// space
				console.log();
			}
		});
	}

	// OMDB
	if(process.argv[2] === "movie-this") {

		// check process.argv[3] for movie name, then display:
		if(process.argv[3]) {

			movieSearch = process.argv[3];
		}

		else {

			movieSearch = defaultMovie;
		}

		movieQueryURL = "http://www.omdbapi.com/?t=" + movieSearch + "&apikey=" + keys.OMDBKey;

		// call OMDB and get movie
		request.get({ url: movieQueryURL }, function(err, movie) {

		    if(err) {

		        return console.error(err);
		    }

		    parsedResponse = JSON.parse(movie.body);

		    console.log("Title: " + parsedResponse.Title);
		    console.log("Year: " + parsedResponse.Year);
		    console.log("IMDB Rating: " + parsedResponse.imdbRating);
		    console.log("Rotten Tomatoes Rating: " + parsedResponse.Ratings[1].Value);
		    console.log("Country: " + parsedResponse.Country);
		    console.log("Language: " + parsedResponse.Language);
		    console.log("Plot: " + parsedResponse.Plot);
		    console.log("Actors: " + parsedResponse.Actors);
		});
	}
}

// program execution starts here
doStuff();