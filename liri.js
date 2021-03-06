const keys = require("./keys");

const defaultTrack = "The Sign";
const defaultArtist = "Ace of Base";
const defaultMovie = "Mr. Nobody";

const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
const moment = require("moment");
	 
var twitterClient = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.token_key,
  access_token_secret: keys.twitterKeys.token_secret,
});
 
var twitterParams = {screen_name: "Mike_Bootcamp", count: 20};

var spotify = new Spotify({
	id: keys.spotifyKeys.client_id,
	secret: keys.spotifyKeys.client_secret
});

var spotifySearch;
var spotifyArtist;
var foundFlag = false;
var movieSearch;
var movieQueryURL;
var parsedResponse;
var incomingData = [];
var stringToWrite ="Log Entry: " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n";

/*
 * writeToLog()
 * append stringToWrite to log.txt
 */
function writeToLog() {

	for(var i = 0; i < 80; i++) {
		stringToWrite += "=";
	}
	
	fs.appendFile("log.txt", stringToWrite + "\n", "utf8", function(err) {
	
		if(err) {
			return console.log(err);
		}
	});
}

/*
 * doStuff()
 * this is where the magic happens.
 */
function doStuff() {

	// twitter
	if(process.argv[2] === "my-tweets") {

		// get tweets
		twitterClient.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {

		 	if (!error) {
				
				tweets = tweets.reverse();

		 		for(var i = 0; i < tweets.length && i < 20; i++) {
				
					console.log(tweets[i].text);
					stringToWrite += (tweets[i].text + "\n");
				}

				writeToLog();
			}

		 	else {

		 		console.log(JSON.stringify(error));
			}
		});
	}

	// spotify search
	if(process.argv[2] === "spotify-this-song") {

		// if command line arg...
		if(process.argv[3]) {

			spotifySearch = process.argv[3];

			// ...and artist arg in pos 4
			if(process.argv[4]) {

				spotifyArtist = process.argv[4];
			}
		}

		else {

			// else default search ("The Sign" by Ace of Base)
			spotifySearch = defaultTrack;
		}

		spotify.search({ type: 'track', query: "\"" + spotifySearch + "\"", limit: 20 }, function(error, data) {
	 
	 		if (error) {

	 			return console.log('Error occurred: ' + error);
	 		}

			// if it's a targeted artist search (either default or artist parameter)
			if(!process.argv[3] || spotifyArtist) {

				// loop through "items" array...
				for(var i = 0; i < data.tracks.items.length && !foundFlag; i++) {

					// ...then through artist(s)
					for(var j = 0; j < data.tracks.items[i].artists.length && !foundFlag; j++) {

						// find "Ace of Base" or the artist passed via argv[4]
						if(data.tracks.items[i].artists[j].name === defaultArtist  || 
							(spotifyArtist && data.tracks.items[i].artists[j].name === spotifyArtist)) {

							console.log("Artist(s): " + data.tracks.items[i].artists[j].name);
							stringToWrite += ("Artist(s): " + data.tracks.items[i].artists[j].name + "\n");
									
							console.log("Title: " + data.tracks.items[i].name);
							stringToWrite += ("Title: " + data.tracks.items[i].name + "\n");

							// preview link
							console.log("Spotify Preview Link: " + data.tracks.items[i].preview_url);
							stringToWrite += ("Spotify Preview Link: " + data.tracks.items[i].preview_url + "\n");

							console.log("Spotify Open Link: " + data.tracks.items[i].external_urls.spotify);
							stringToWrite += ("Spotify Open Link: " + data.tracks.items[i].external_urls.spotify + "\n");

							// album name
							console.log("Album: " + data.tracks.items[i].album.name);
							stringToWrite += ("Album: " + data.tracks.items[i].album.name + "\n");

							// set flag to true to stop search
							foundFlag = true;
						}
					}
				}
			}

			else {
				
				// loop through all tracks, displaying info about each one...
				for(i = 0; i < data.tracks.items.length; i++) {

					// track info header
					console.log("Track #" + (i + 1));
					stringToWrite += ("Track #" + (i + 1) + "\n");

					// make sure to  get all artists for each track
					for(j = 0; j < data.tracks.items[i].artists.length; j++) {

						console.log("Artist: " + data.tracks.items[i].artists[j].name);
						stringToWrite += ("Artist: " + data.tracks.items[i].artists[j].name + "\n");
					}
					
					console.log("Title: " + data.tracks.items[i].name);
					stringToWrite += ("Title: " + data.tracks.items[i].name + "\n");

					console.log("Spotify Preview Link: " + data.tracks.items[i].preview_url);
					stringToWrite += ("Spotify Preview Link: " + data.tracks.items[i].preview_url + "\n");

					console.log("Spotify Open Link: " + data.tracks.items[i].external_urls.spotify);
					stringToWrite += ("Spotify Open Link: " + data.tracks.items[i].external_urls.spotify + "\n");

					console.log("Album: " + data.tracks.items[i].album.name + "\n");
					stringToWrite += ("Album: " + data.tracks.items[i].album.name + "\n\n");
				}
			}

			// write stringToWrite to log file
			writeToLog();
		});
	}

	// OMDB search
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
		request(movieQueryURL, function(error, movie) {

		    if(error) {

		        return console.error(error);
		    }

		    parsedResponse = JSON.parse(movie.body);

		    //display to console and build stringToWrite
		    console.log("Title: " + parsedResponse.Title);
			stringToWrite += ("Title: " + parsedResponse.Title + "\n");

		    console.log("Year: " + parsedResponse.Year);
			stringToWrite += ("Year: " + parsedResponse.Year + "\n");

		    console.log("IMDB Rating: " + parsedResponse.imdbRating);
			stringToWrite += ("IMDB Rating: " + parsedResponse.imdbRating + "\n");

		    console.log("Rotten Tomatoes Rating: " + parsedResponse.Ratings[1].Value);
			stringToWrite += ("Rotten Tomatoes Rating: " + parsedResponse.Ratings[1].Value + "\n");

		    console.log("Country: " + parsedResponse.Country);
			stringToWrite += ("Country: " + parsedResponse.Country + "\n");

		    console.log("Language: " + parsedResponse.Language);
			stringToWrite += ("Language: " + parsedResponse.Language + "\n");

		    console.log("Plot: " + parsedResponse.Plot);
			stringToWrite += ("Plot: " + parsedResponse.Plot + "\n");

		    console.log("Actors: " + parsedResponse.Actors);
			stringToWrite += ("Actors: " + parsedResponse.Actors + "\n");

			// write stringToWrite to log file
			writeToLog();
		});
	}
}

// check to see if args are to be read from file...
if(process.argv[2] === "do-what-it-says") {

	// open random.txt
	fs.readFile("random.txt", function(error,data) {

        if(error) {

            return console.log(error)
        }

        else {

        	incomingData = data.toString().split(",");

			process.argv[2] = incomingData[0];
			process.argv[3] = incomingData[1];

			doStuff();
        }
    });
}

// ...else program execution starts here
else {

	doStuff();
}