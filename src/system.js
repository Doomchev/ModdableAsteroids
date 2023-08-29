import Canvas, {currentCanvas, setCanvas} from "./canvas.js";
import {init} from "../main.js";

export let ctx, mousesx, mousesy, zk = 1.2;

export let root = {
    keys: {},
    images: {},
    scene: [],
    logic: []
};

export class Executable {
    execute() {
    }
}

export function toRadians(angle) {
    return Math.PI * angle / 180.0;
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