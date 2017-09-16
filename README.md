# liri-node-app
HW #8 Node Liri Bot
Command line node.js application that takes in parameters to determine an appropriate action:

"node liri.js my-tweets": Display 20 tweets from my (recently created) Mike_Bootcamp twitter feed.  NOTE: Reversed order of display, so that oldest will display first.

"node liri.js spotify-this-song <'song title'>": Display info about 20 songs that match the 'song title' parameter.  If no parameters are provided, the default song is "The Sign" by Ace of Base.  ** Added optional <'artist'> param handler to refine search.  Ex: node liri.js spotify-this-song "Two Step" "Dave Matthews Band" will only return one song. ** Also included spotify "open link" as I thought that could be usesful.

"node liri.js movie-this <'movie title'>": display info about the 'movie title' parameter (else default is "Mr. Nobody").

"node liri do-what-it-says": take in the argv[2] and argv[3] parameters from a file named random.txt.

node packages used: twitter, spotify, request (OMDB), moment (timestamping) & fs (file i/o).

All info is written (appended) to a local text file, log.txt, timestamped via moment.js.
