

var cursors;
var mySkeleton;
var mapwidth;
var mapheight;
var tileWidthHalf;
var tileHeightHalf;
const DOOR_TILE = 9;
var mymapArr = [];

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
    },
    attack: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.11
    },
    die: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    shoot: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.1
    }
};



var d = 0;

var scene;

// GameObject Skeleton
class Skeleton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, motion, direction, distance) {
        super(scene, x, y, 'skeleton', direction.offset);

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
//       console.log("animo da fermo con animazione " , mySkeleton.anim.startFrame, mySkeleton.anim.endFrame);
    } else {
//       console.log("animo in movimento con animazione " , mySkeleton.anim.startFrame, mySkeleton.anim.endFrame);
         this.f++;
  }

//console.log("Frame n.", this.f);

        var delay = this.anim.speed;
        this.anim=anims[this.motion];

       if (this.f === this.anim.endFrame)        {
           this.f = this.anim.startFrame;
        }

  //      if (this.f === this.anim.endFrame)        {
            switch (this.motion)            {
                case 'walk':
                     this.frame = this.texture.get(this.direction.offset + this.f);
                    scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'idle':
                     this.frame = this.texture.get(this.direction.offset + this.f);
//                   delay = 0.5 + Math.random();
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

            }
//       }  else   {
//           this.frame = this.texture.get(this.direction.offset + this.f);

//           scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
//       }
    }

    resetAnimation ()   {
        this.f = this.anim.startFrame;
        this.frame = this.texture.get(this.direction.offset + this.f);
        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }






    update()  { // skeleton update
        if (this.motion === 'walk')   {
            var currX = this.x;
            var currY = this.y;
            var iso = this.toIso(currX,currY);
            var nextX = currX + this.direction.x * this.speed;
            var nextY = currY + this.direction.y * this.speed;
            var iso2 = this.toIso(nextX,nextY);

console.log(iso.x, iso.y , "==>" , iso2.x, iso2.y);
            if ((iso.x !==  iso2.x ) || (iso.y !== iso2.y)) {
console.log("Can move from ", iso.x, iso.y, " to ",  iso2.x, iso2.y , "?");
              if (this.isWalkable(nextX,nextY)) {
console.log("Moving from ", iso.x, iso.y , " to " , iso2.x, iso2.y);
                this.x += this.direction.x * this.speed;

                if (this.direction.y !== 0)  {
                    this.y += this.direction.y * this.speed;
                    this.depth = this.y + 64;
                }
              } else {
console.log("UPDATE - Not moved");
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
        x: ((x / tileWidthHalf  + y / tileHeightHalf) /2 - mapwidth/2).toFixed(0)*1 -1,
        y: ((y / tileHeightHalf -(x / tileWidthHalf)) /2 + mapheight/2).toFixed(0)*1 -1
        }
    }




    isWalkable(xCart,yCart) { // debug
            const data = scene.cache.json.get('map');
            var layer = data.layers[0].data;
            var id;
            var xIso;
            var yIso;


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
            if ((id >=0 ) && (id != DOOR_TILE)) {
console.log("WALKABLE - COLLISION on  ", xIso ,yIso , "  with tile " , id);
             return false;
            } else {
//
            }


/*
            let i = 0;
            for (let y = 0; y < mapheight; y++)        {
                for (let x = 0; x < mapwidth; x++)            {
                    id = layer[i] - 1;
                    if ((x === xIso) && (y === yIso)) {
                      if ((id >=0 ) && (id != DOOR_TILE)) {
console.log("WALKABLE - COLLISION on  ", xIso ,yIso , "  with tile " , id);
                       return false;
                      } else {
//
                      }
                    } else {
                      // just skip
                    }
                    i++;
                }// x
            } //y
*/


console.log("WALKABLE - Authorized to walk to  ", xIso, yIso, id);
            return true;
    }

} // Skeleton()

class Example extends Phaser.Scene{
    constructor ()    {
        super();
    }



    preload ()    {
        this.load.json('map', 'https://raw.githubusercontent.com/jumpjack/melonJS_isometric_example/master/isometric_rpg/data/map/isometric-mio.json');//assets/tests/iso/isometric-grass-and-water.json');
        this.load.spritesheet('tiles', 'https://raw.githubusercontent.com/jumpjack/melonJS_isometric_example/master/isometric_rpg/data/img/single.png', { frameWidth: 24, frameHeight:40 });//assets/tests/iso/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton', 'https://raw.githubusercontent.com/jumpjack/melonJS_isometric_example/master/isometric_rpg/data/img/players-mod.png', { frameWidth: 17, frameHeight: 34 });
//        this.load.spritesheet('skeleton', 'assets/tests/iso/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('house', 'assets/tests/iso/rem_0002.png');
    }

    create ()    {
        scene = this;

        this.buildMap();
        this.placeHouses();

        // create skeleton:
        mySkeleton = new Skeleton(this, 50, 110, 'walk', 'southEast', 100);

        // Add skeleton to map:
        this.add.existing(mySkeleton);

        this.cameras.main.setSize(1600, 600);

        cursors = this.input.keyboard.createCursorKeys();

    }

    update () { // phaser scene update

        if (cursors.left.isDown) {
            mySkeleton.direction = directions["northWest"];
            mySkeleton.motion = "walk"
            mySkeleton.anim=anims["walk"];
         }   else if (cursors.right.isDown) {
            mySkeleton.direction = directions["southEast"];
            mySkeleton.motion = "walk"
            mySkeleton.anim=anims["walk"];
        }   else if (cursors.up.isDown) {
            mySkeleton.direction = directions["northEast"];
            mySkeleton.motion = "walk"
            mySkeleton.anim=anims["walk"];
        }   else if (cursors.down.isDown) {
            mySkeleton.direction = directions["southWest"];
            mySkeleton.motion = "walk"
            mySkeleton.anim=anims["walk"];
        } else {
            mySkeleton.motion = "idle"
            mySkeleton.anim=anims["idle"];
//           console.log("fermo");
        }

mySkeleton.frame = mySkeleton.texture.get(mySkeleton.direction.offset + mySkeleton.f);

        mySkeleton.update();
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

            const centerX = mapwidth * tileWidthHalf;
            const centerY = 16;

            let i = 0;


            var mymap = "   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0\n\r0 ";
            for (let y = 0; y < mapheight; y++)        {
                if (layerIndex===0) rowArr = [];
                for (let x = 0; x < mapwidth; x++)            {
                    var id = layer[i] - 1;
                    if (id >= 0) {
                      if (id > 100) {
                        id = id - Math.pow(2,32)/2;
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
                        const tile = scene.add.image(centerX + tx, centerY + ty - layerIndex*6, 'tiles', id);
                        tile.depth = centerY + ty + 64;  /// Occlusions are defined here
                    } else {
                      //  empty tile
                    }
                    if (id > 100) {
                      // to do: flip tile
                        const tile = scene.add.image(centerX + tx, centerY + ty - layerIndex*6, 'tiles', id - Math.pow(2,32)/2);
                        tile.depth = centerY + ty + 64;  /// Occlusions are defined here
                    }
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

    placeHouses ()    {
        const house_1 = scene.add.image(240, 370, 'house');
        house_1.depth = house_1.y + 86;

        const house_2 = scene.add.image(1300, 290, 'house');
        house_2.depth = house_2.y + 86;
    }
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
