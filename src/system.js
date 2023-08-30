import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import {init, textures} from "../main.js"

export let  zk = 1.2, fps = 50.0, showCollisionShapes = false
export let ctx, mousesx, mousesy, fpsk = 1.0 / fps

export let root = {
    keys: [],
    scene: [],
    logic: []
}

export class Renderable {
    draw() {}
}

export class Executable {
    execute() {}
}

export class Value {
    toBoolean() {
        return true
    }
}

export function toRadians(angle) {
    return Math.PI * angle / 180.0
}

export let current = {
    sprite: null,
    toSprite() {
        return this.sprite
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    setCanvas(new Canvas(0, 0, canvas.clientWidth, canvas.clientHeight, 50.0))

    let entries = Object.entries(textures)
    let imagesToLoad = entries.length
    entries.forEach((entry) => {
        let image = new Image()
        image.onload = () => {
            imagesToLoad--
            if(imagesToLoad <= 0) {
                init()
                setInterval(function() {
                    root.logic.forEach((module) => module.execute())
                    currentCanvas.draw()
                }, 20)
            }
        }
        image.src = entry[1]
        textures[entry[0]] = image
    })
})

document.addEventListener("keydown", (event) => {
    root.keys.forEach((key) => {
        if(event.code === key.code) {
            key.isDown = true
        }
    })
}, false)

document.addEventListener("keyup", (event) => {
    root.keys.forEach((key) => {
        if(event.code === key.code) {
            key.isDown = false
        }
    })
}, false)