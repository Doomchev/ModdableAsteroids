import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import {init, textures} from "../asteroids.js"

// global variables

export let  zk = 1.2, fps = 100.0, showCollisionShapes = false
export let ctx, mousesx, mousesy, fpsk = 1.0 / fps

export let root = {
    keys: [],
    scene: [],
    actions: []
}

export let current = {
    sprite: null,
    toSprite() {
        return this.sprite
    }
}

// basic classes

export class Renderable {
    draw() {}
}

export class Executable {
    execute() {}
}

export class Value {
    toBoolean() {return true}
}

// global functions

export function toRadians(angle) {
    return Math.PI * angle / 180.0
}

export function randomInt(from, to) {
    return Math.floor(randomFloat(from, to))
}

export function randomFloat(from, to) {
    return to === undefined ? Math.random() * from : Math.random() * (to - from) + from
}

export function randomSign() {
    return 2 * randomInt(2) - 1
}

export function executeCode(code) {
    if(code instanceof Array) {
        code.forEach(item => item.execute())
    } else {
        code.execute()
    }
}

// listeners

document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas")
    canvas.focus()
    ctx = canvas.getContext("2d")
    setCanvas(new Canvas(0, 0, canvas.clientWidth, canvas.clientHeight, 50.0))

    let entries = Object.entries(textures)
    let imagesToLoad = entries.length
    entries.forEach(entry => {
        let image = new Image()
        image.onload = () => {
            imagesToLoad--
            if(imagesToLoad <= 0) {
                init()
                setInterval(function() {
                    root.actions.forEach(module => module.execute())
                    currentCanvas.draw()
                }, 20)
            }
        }
        image.src = entry[1]
        textures[entry[0]] = image
    })
})

document.addEventListener("keydown", event => {
    if(event.code === "F9") showCollisionShapes = !showCollisionShapes
    root.keys.forEach(key => {
        if(event.code === key.code) {
            key.isDown = true
        }
    })
}, false)

document.addEventListener("keyup", event => {
    root.keys.forEach(key => {
        if(event.code === key.code) {
            key.isDown = false
        }
    })
}, false)