# Phaser-Isometric-Demo
Isometric game demo for Phaser 3.5

[Live demo](https://jumpjack.github.io/phaser-isometric-demo/docs/) is in [/docs folder](https://github.com/jumpjack/phaser-isometric-demo/tree/main/docs).

Another isometric demo, but without sprite for player, is on Phaser site:

![immagine](https://user-images.githubusercontent.com/1620953/203593434-d4ce2ba3-6f90-4067-835b-faf6f334d9ca.png)


 - [Editor](http://labs.phaser.io/edit.html?src=src%5Ctilemap%5Cisometric%5Cisometric%20test.js)
 - [Folder for .js source code](http://labs.phaser.io/src/tilemap/isometric/)
 - [Map](http://labs.phaser.io/assets/tilemaps/iso/isorpg.json)  (JSON in Tiled format)
 - [Folder of map](http://labs.phaser.io/assets/tilemaps/iso/)
 - 


# Original readme.md
The demo is based on the following tutorial for Phaser 2 and rewritten for the newest version of Phaser. Scene management and depth sorting is now native to Phaser and Webpack is used to support bundling and ES6.

[An Updated Primer for Creating Isometric Worlds, Part 1](https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-primer-for-game-developers-updated--cms-28392)

## Demo
Open [demo](https://daan93.github.io/phaser-isometric-demo/)

## Todo
- [x] Add pointer interaction
- [x] Add path finding with easystar.js
- [x] Add scrolling
- [x] Make game responsive
- [ ] Add ways to interact with other characters
- [ ] Add a store to spend coins
- [x] Look into phasers dynamic tyle sprites (from tiled)
- [ ] ~~Improve isWalkable() by implementing collision physics~~ Don't use 2d for isometric physics, use Enable3d instead.
- [ ] ~~Look into isophyics with height (z-axis) support~~

## CLI

### Watch
Watch file changes and bundle to /dist

### Start
Start Webpack-dev-server and open browser

### Build
Bundle to /dist
