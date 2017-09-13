# liri-node-app
HW #8 Node Liri Bot
This is a command line application that takes in parameters to determine the appropriate action:

"node liri.js my-tweets" will display tweets.

"node liri.js spotify-this-song <'song title'>" will display info about the 'song title' parater (else default is "The Sign" by Ace of Base.

"node liri.js movie-this <'movie title'>" will display info about the 'movie title' parameter (else default is "Mr. Nobody").

"node liri do-what-it-says" will take in the argv[2] and argv[3] parameters from a file named random.txt.

node packages used: twitter, spotify, request (OMDB) & fs (file i/o).

All info is written (appended) to a local text file, log.txt, timestamped via moment.js.
