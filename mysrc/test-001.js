// to be used in sandbox (labs.phaser.io)

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
