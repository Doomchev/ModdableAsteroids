import Canvas, {currentCanvas, setCanvas} from "./canvas.js";
import Image from "./image.js";
import Sprite from "./sprite.js";

export let ctx, mousesx, mousesy, zk = 1.2;

export let root = {
    keys: {},
    images: {},
    scene: []
};

class Key {
    constructor(code) {
        this.code = code;
        this.isDown = false;
    }
}

function init() {
    let ship = new Sprite(new Image(document.getElementById("ship")));
    root.ship = ship
    root.background = "rgb(9, 44, 84)";
    root.keys.right = new Key("KeyA");
    root.keys.left = new Key("KeyD");
    root.scene = [ship];
}

function logic() {
    let ship = root.ship;
    if(root.keys.left.isDown) {
        ship.angle += 5.0 * Math.PI / 180.0;
    }
    if(root.keys.right.isDown) {
        ship.angle -= 5.0 * Math.PI / 180.0;
    }
}

function render() {
    currentCanvas.draw();
}



document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    setCanvas(new Canvas(0, 0, canvas.clientWidth, canvas.clientHeight, 50.0));

    init();
    setInterval(function() {
        logic();
        render();
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