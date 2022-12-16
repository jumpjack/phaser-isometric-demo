// to be pasted in online editor:  https://labs.phaser.io/edit.html
var getObjectKey;
var getObjectKeyDown;
var getObjectKeyUp;

var cursors;
var myPlayer;
var mapwidth;
var mapheight;
var tileWidthHalf;
var tileHeightHalf;
const DOOR_TILE = 9;
var mymapArr = [];

var doors = [
  {room: 0, x : 4, y : 8, open: false},
  {room: 0, x : 8, y : 2, open: false},
  {room: 0, x : 8, y : 7, open: false}
];

var keys = [
  { door: doors[0], owned : false },
  { door: doors[1], owned : false },
  { door: doors[2], owned : false }
]

var availableObjects = [
  {
    type: "key",
    id : "doorKey01",
    keyNumber: 0,
    pickable : true,
    picked : false,
    room: 0,
    x : 3,
    y : 1,
    worksWith: doors[0]
  },
  {
    type: "info",
    id : "info01",
    keyNumber: null,
    pickable : false,
    picked : null,
    room: 0,
    x : 2,
    y : 4,
    worksWith: null
  }
]



var touchedObject;

var directions = {
    west: { offset: 0, x: -2, y: 0, opposite: 'east' },
    northWest: { offset: 4, x: -2, y: -1, opposite: 'southEast' },
    north: { offset: 8, x: 0, y: -2, opposite: 'south' },
    northEast: { offset: 12, x: 2, y: -1, opposite: 'southWest' },
    east: { offset: 16, x: 2, y: 0, opposite: 'west' },
    southEast: { offset: 20, x: 2, y: 1, opposite: 'northWest' },
    south: { offset: 24, x: 0, y: 2, opposite: 'north' },
    southWest: { offset: 28, x: -2, y: 1, opposite: 'northEast' }
};

var anims = {
    idle: {
        startFrame: 0,
        endFrame: 1,
        speed: 0.15
    },
    walk: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.15
    }
};



var d = 0;

var scene;

// GameObject Player
class Player extends Phaser.GameObjects.Image {
    constructor(scene, x, y, motion, direction, distance) {
        super(scene, x, y, 'Player', direction.offset);

        this.startX = x;
        this.startY = y;
        this.distance = distance;

        this.motion = motion;
        this.anim = anims[motion];
        this.direction = directions[direction];
        this.speed = 0.20;
        this.f = this.anim.startFrame;

        this.depth = y + 64;

        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }



    changeFrame ()    {
    if (this.motion === "idle") {
       this.f++;
    } else {
         this.f++;
  }


        var delay = this.anim.speed;
        this.anim=anims[this.motion];

       if (this.f === this.anim.endFrame)        {
           this.f = this.anim.startFrame;
        }

            switch (this.motion)            {
                case 'walk':
                     this.frame = this.texture.get(this.direction.offset + this.f);
                    scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'idle':
                     this.frame = this.texture.get(this.direction.offset + this.f);
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

            }
    }

    resetAnimation ()   {
        this.f = this.anim.startFrame;
        this.frame = this.texture.get(this.direction.offset + this.f);
        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }






    update()  { // Player update
        if (this.motion === 'walk')   {
            var currX = this.x;
            var currY = this.y;
            var iso = this.toIso(currX,currY);
            var nextX = currX + this.direction.x * this.speed;
            var nextY = currY + this.direction.y * this.speed;
            var iso2 = this.toIso(nextX,nextY);

console.log(currX.toFixed(2), currY.toFixed(2),iso.x, iso.y , "==>" , iso2.x, iso2.y, touchedObject);
            if ((iso.x !==  iso2.x ) || (iso.y !== iso2.y)) {
console.log("Can move from ", iso.x, iso.y, " to ",  iso2.x, iso2.y , "?");
              var walkTest = this.isWalkable(nextX,nextY);
              if (walkTest.walk) {
console.log("Moving from ", iso.x, iso.y , " to " , iso2.x, iso2.y);
                this.x += this.direction.x * this.speed;

                if (this.direction.y !== 0)  {
                    this.y += this.direction.y * this.speed;
                    this.depth = this.y + 64;
                }
              } else {
console.log("UPDATE - Not moved; object:",walkTest);
              }
            } else {
//console.log("Next tile is the same");
                this.x += this.direction.x * this.speed;
                if (this.direction.y !== 0)  {
                    this.y += this.direction.y * this.speed;
                    this.depth = this.y + 64;
                }
            }
        }
    }

    toIso(x,y) {
      return {
        x: (((x) / tileWidthHalf  + (y+tileHeightHalf) / tileHeightHalf) /2  ).toFixed(0) -7,
        y: (((y+tileHeightHalf) / tileHeightHalf - (x) / tileWidthHalf) /2).toFixed(0)*1 + 3.0
        }
    }




    isWalkable(xCart,yCart) { // debug
      var returnValue;
      const data = scene.cache.json.get('map');
      var layer = data.layers[0].data;
      var id;
      var xIso;
      var yIso;
      var room = 0; //debug


      mapwidth = data.layers[0].width;
      mapheight = data.layers[0].height;

      const centerX = mapwidth * tileWidthHalf;
      const centerY = mapheight * tileHeightHalf;

      xCart = xCart;
      yCart = yCart;

      var iso = this.toIso(xCart,yCart);
      xIso = iso.x
      yIso = iso.y;

      id = mymapArr[iso.y][iso.x];

      this.checkObject(room, xIso,yIso);

      returnValue = {walk:true, tile: id, obj :  touchedObject};

      if ((id >=0 ) && (id !== DOOR_TILE)) {
console.log("WALKABLE - COLLISION on  ", xIso ,yIso , "  with tile " , id);
       returnValue.walk = false;
       returnValue.tile = id;
      } else {
        //
      }


      if (id === DOOR_TILE) {
        if (this.checkKey(room, xIso,yIso)) {
          returnValue.walk = true;
          returnValue.tile = id;
console.log("WALKABLE - Authorized to walk to  ", xIso, yIso, id);
        } else {
console.log("WALKABLE - CLOSED DOOR - Not uthorized to walk to  ", xIso, yIso, id);
          returnValue.walk = false;
          returnValue.tile = id;
        }
      }


      return returnValue;
    }


    checkObject(r,x,y) {
      //availableObjects.forEach( (myObj) => {
      var foundObj = false;
      for (var avalObjIndex = 0; ((avalObjIndex < availableObjects.length) && (!foundObj)); avalObjIndex++) {
        var myObj = availableObjects[avalObjIndex];
        if ((myObj.room === r ) && (myObj.x === x ) && (myObj.y === y)) {
console.log("Touched object ",myObj.id , " in " , x,y);
          touchedObject =  myObj;
          foundObj = true;
        } else {
          touchedObject =  null;
        }
      }//);
    }

    checkKey(r,x,y) {
console.log("keys=", keys);
      //keys.forEach( (key) => {
      var keyFound = false;
      for (var keyIndex = 0; ((keyIndex < keys.length) && (!keyFound)); keyIndex++) {
        var key = keys[keyIndex];
console.log("Checking ", key.door.room, key.door.x, key.door.y, key.owned, " against " , r,x,y, ":", (key.door.room === r ), (key.door.x === x ) , (key.door.y === y) , (key.owned === true));
        if ((key.door.room === r ) && (key.door.x === x ) && (key.door.y === y) && (key.owned === true)) {
console.log("KEY FOUND!")
          keyFound = true;
          return true;
        } else {
console.log("Missing key for door in ",x,y);
          return false;
        }
      }//);
    }


} // Player()




class Example extends Phaser.Scene{
    constructor ()    {
        super();
    }



    preload ()    {
        this.load.json('map', 'https://raw.githubusercontent.com/jumpjack/melonJS_isometric_example/master/isometric_rpg/data/map/isometric-mio.json');
        this.load.spritesheet('tiles', 'https://raw.githubusercontent.com/jumpjack/melonJS_isometric_example/master/isometric_rpg/data/img/single.png', { frameWidth: 24, frameHeight:40 });
        this.load.spritesheet('Player', 'https://raw.githubusercontent.com/jumpjack/melonJS_isometric_example/master/isometric_rpg/data/img/players-mod.png', { frameWidth: 17, frameHeight: 34 });
    }

    create ()    {
        scene = this;

        this.buildMap();

        // create Player:
        myPlayer = new Player(this, 96,72, 'walk', 'southEast', 100);

        // Add Player to map:
        this.add.existing(myPlayer);

        this.cameras.main.setSize(1600, 600);

        cursors = this.input.keyboard.createCursorKeys();
        getObjectKey = scene.input.keyboard.addKey('Q');
        getObjectKeyDown = getObjectKey.isDown;
        getObjectKeyUp = getObjectKey.isUp;
        getObjectKey.on('down', this.pickUp);
    }


    pickUp(ev) {
console.log("Touched: ", touchedObject);
      var myObj = availableObjects.find(x => x.id === touchedObject.id);
      if (myObj.pickable) {
        myObj.picked = true;
        if (myObj.type === "key") {
          keys[myObj.keyNumber].owned = true;
        } else {
console.log("Object pickable but not a key");
        }
      } else {
console.log("Static object");
        if (myObj.type === "info") {
console.log("INFO BOX ACTIVATED");
        }
      }
      console.log("availableObjects=",availableObjects)
    }

    update () { // phaser scene update

        if (cursors.left.isDown) {
            myPlayer.direction = directions["northWest"];
            myPlayer.motion = "walk"
            myPlayer.anim=anims["walk"];
         }   else if (cursors.right.isDown) {
            myPlayer.direction = directions["southEast"];
            myPlayer.motion = "walk"
            myPlayer.anim=anims["walk"];
        }   else if (cursors.up.isDown) {
            myPlayer.direction = directions["northEast"];
            myPlayer.motion = "walk"
            myPlayer.anim=anims["walk"];
        }   else if (cursors.down.isDown) {
            myPlayer.direction = directions["southWest"];
            myPlayer.motion = "walk"
            myPlayer.anim=anims["walk"];
        } else {
            myPlayer.motion = "idle"
            myPlayer.anim=anims["idle"];
        }


myPlayer.frame = myPlayer.texture.get(myPlayer.direction.offset + myPlayer.f);

        myPlayer.update();
    }

    normLen(a) {
      if (a.length == 1)
        return " " + a;
      else
        return a;
    }




    buildMap ()    {
        //  Parse the data out of the map
        const data = scene.cache.json.get('map');
        var rowArr = [];

        mapwidth = data.layers[0].width;
        mapheight = data.layers[0].height;


        const tilewidth = data.tilewidth;
        const tileheight = data.tileheight;

        tileWidthHalf = tilewidth / 2;
        tileHeightHalf = tileheight / 2;

    var layer;
        for (var layerIndex=0; layerIndex<data.layers.length; layerIndex++) {
            layer = data.layers[layerIndex].data;
            const mapwidth = data.layers[layerIndex].width;
            const mapheight = data.layers[layerIndex].height;
            const yoffset = data.layers[layerIndex].offsety;
console.log(data.layers[layerIndex], yoffset);
            const centerX = mapwidth * tileWidthHalf;
            const centerY = 16;

            let i = 0;
            var toFlip;

            var mymap = "   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0\n\r0 ";
            for (let y = 0; y < mapheight; y++)        {
                if (layerIndex===0) rowArr = [];
                for (let x = 0; x < mapwidth; x++)            {
                    var id = layer[i] - 1;
                    if (id >= 0) {
                      if (id > 100) {
                        id = id - Math.pow(2,32)/2;
                        toFlip=true;
                      } else {
                          toFlip = false;
                      }
                      id = this.normLen(id);
                      mymap += id + ","
                      if (layerIndex === 0) rowArr.push(id);
                    } else {
                      mymap += "  ,";
                      if (layerIndex === 0) rowArr.push(-1);
                    }

                    const tx = (x - y) * tileWidthHalf;
                    const ty = (x + y) * tileHeightHalf;

                    if ((id >=0 ) &&  (id<100)) {
                        var tile = scene.add.image(centerX + tx, centerY + ty + yoffset, 'tiles', id);
                        tile.depth = centerY + ty + 64;  /// Occlusions are defined here
                    } else {
                      //  empty tile
                    }
                    if (id > 100) {
                        var tile = scene.add.image(centerX + tx, centerY + ty + yoffset, 'tiles', id - Math.pow(2,32)/2);
                        tile.depth = centerY + ty + 64;  /// Occlusions are defined here
                    }
                    if (toFlip) tile.setFlipX(true);
                    i++;
                } // x
                mymap +="\n\r" + (y+1) + " ";
                if (layerIndex === 0) {
                  rowArr.push(-1);
                  mymapArr.push(rowArr);
                }
            } //y
            console.log(mymap);
            if (layerIndex === 0) {
              mymapArr.push([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
              console.log(mymapArr);
            }
        } // layerIndex
    } // buildMap()

}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#ababab',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
