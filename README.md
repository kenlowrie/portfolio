# portfolio
This is my online portfolio website that is published on <a href="https://klowrie.net/cs" target="_blank">klowrie.net</a>.

I put this together to make it easier for prospective clients to learn about my background and experience. A little easier to just shoot a link to this site instead of writing out a long email or other summary. It's a work in progress, and probably always will be. 

If you have questions, or would like to provide feedback and/or to report a bug, feel free to contact the author, Ken Lowrie, at [www.kenlowrie.com](http://www.kenlowrie.com/).

### Attributions

Currently, I don't have anything specific to call out. I put this site together mostly from scratch, using some sample code from [Bootstrap](https://getbootstrap.com) as well as other code from one or more training courses I've taken over the years.

#### Installing this app to your server

This is a [Gulp](http://gulpjs.com/) project, so you'll need [Node.js](https://nodejs.org/en/) installed on your build machine in order to put the distribution together. Follow the link above to learn about Gulp and how to set it up on your system, just make sure to install and configure Node.js first.

Once you've installed Node.js, simply checkout the source tree from Github to a local directory on your system, and issue: "npm install" to automatically pull down the various Gulp modules you need to build a distribution.

Then, run "gulp" to build a development version, or "NODE_ENV=rel gulp" to build a release version (the only difference is that your CSS and JS will be minified in the release version.

Running Gulp will create a "Build/dev" or "Build/rel" depending on how the NODE_ENV variable is set. Go into the corresponding directory, and then transfer all the files up to your server, maintaining the directory structure, and you'll be all set.

That's it! If you run into any problems, feel free to contact me for assistance.
