import Canvas, {currentCanvas, setCanvas} from "./canvas.js";
import {images, init} from "../main.js";

export let ctx, mousesx, mousesy, zk = 1.2;

export let root = {
    keys: [],
    scene: [],
    logic: []
};

export class Renderable {
    draw(sx, sy, swidth, sheight) {}
}

export class Executable {
    execute() {}
}

export class Value {
    toBoolean() {
        return true;
    }
}

export function toRadians(angle) {
    return Math.PI * angle / 180.0;
}

document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    setCanvas(new Canvas(0, 0, canvas.clientWidth, canvas.clientHeight, 50.0));

    let entries = Object.entries(images);
    let imagesToLoad = entries.length;
    entries.forEach((entry) => {
        let image = new Image();
        image.onload = () => {
            imagesToLoad--;
            if(imagesToLoad <= 0) {
                init();
                setInterval(function() {
                    root.logic.forEach((module) => {
                        module.execute();
                    });
                    currentCanvas.draw();
                }, 20);
            }
        }
        image.src = entry[1];
        images[entry[0]] = image;
    });
});

document.addEventListener("keydown", (event) => {
    root.keys.forEach((key) => {
        if(event.code === key.code) {
            key.isDown = true;
        }
    });
}, false);

document.addEventListener("keyup", (event) => {
    root.keys.forEach((key) => {
        if(event.code === key.code) {
            key.isDown = false;
        }
    });
}, false);