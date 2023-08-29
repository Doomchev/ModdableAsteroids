import Canvas, {currentCanvas, setCanvas} from "./canvas.js";
import Image from "./image.js";
import Sprite, {fpsk} from "./sprite.js";

export let ctx, mousesx, mousesy, zk = 1.2;

export let root = {
    keys: {},
    images: {},
    scene: [],
    logic: []
};

class Key {
    constructor(code) {
        this.code = code;
        this.isDown = false;
    }
}

class Executable {
    execute() {
    }
}

class LinearMoving {
    constructor(object, parameterName, speed, key) {
        this.object = object;
        this.parameterName = parameterName;
        this.speed = speed;
        this.key = key;
    }

    execute() {
        if(this.key.isDown) {
            this.object[this.parameterName] += this.speed * fpsk;
        }
    }
}

function toRadians(angle) {
    return Math.PI * angle / 180.0;
}

function init() {
    let texture = document.getElementById("ship");
    let ship = new Sprite(new Image(texture, 0, 0, texture.width, texture.height
        , 0.35, 0.5, 1.35, 1.9));
    root.ship = ship
    root.background = "rgb(9, 44, 84)";
    root.keys.right = new Key("KeyA");
    root.keys.left = new Key("KeyD");
    root.scene = [ship];

    let logic = root.logic;
    logic[0] = new LinearMoving(ship, "angle", toRadians(180.0), root.keys.left);
    logic[1] = new LinearMoving(ship, "angle", toRadians(-180.0), root.keys.right);
}



document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    setCanvas(new Canvas(0, 0, canvas.clientWidth, canvas.clientHeight, 50.0));

    init();
    setInterval(function() {
        for(let i = 0; i < root.logic.length; i++) {
            root.logic[i].execute();
        }
        currentCanvas.draw();
    }, 20)
});

document.addEventListener("keydown", (event) => {
    for(const[name, key] of Object.entries(root.keys)) {
        if(event.code === key.code) {
            key.isDown = true;
        }
    }
}, false);

document.addEventListener("keyup", (event) => {
    for(const[name, key] of Object.entries(root.keys)) {
        if(event.code === key.code) {
            key.isDown = false;
        }
    }
}, false);