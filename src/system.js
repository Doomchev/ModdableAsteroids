import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import SpriteVariable from "./variable/sprite.js"
import {Value} from "./value.js"
import {project} from "./project.js"

// global variables

export let zk = 1.2, fps = 60.0, aps = 200.0, showCollisionShapes = false
export let ctx, mousesx, mousesy, apsk = 1.0 / aps

// enums

export let align = {
    left: 0,
    top: 0,
    center: 1,
    right: 2,
    bottom: 2
}

// global functions

export function rad(angle) {
    return Math.PI * angle / 180.0
}

export function randomInt(from, to) {
    return Math.floor(rnd(from, to))
}

export function rnd(from = 1, to) {
    return to === undefined ? Math.random() * from : Math.random() * (to - from) + from
}

export function randomSign() {
    return 2 * randomInt(2) - 1
}

export function removeFromArray(item, array) {
    let i = array.indexOf(item)
    if(i < 0) return
    array.splice(i, 1)
}

export function num(value) {
    return typeof value === "number" ? value : value.toNumber()
}

export function setName(object, name) {
    if (name) {
        project._object[name] = object
        object._name = name
    }
}

// code, collisions

export let collisionSprite1 = new SpriteVariable("collisionSprite1")
export let collisionSprite2 = new SpriteVariable("collisionSprite2")

export function executeCollisionCode(sprite1, sprite2, code) {
    collisionSprite1.sprite = sprite1
    collisionSprite2.sprite = sprite2
    code.call()
}

// textures

let textureSource = new Map()
export function addTextures(textureMap) {
    for(let [name, src] of Object.entries(textureMap)) {
        let texture = new Image();
        texture._name = name
        textureSource.set(texture, src)
        project.texture[name] = texture
    }
}

export function addTexturesToObjects(objects) {
    for(let [name, texture] of Object.entries(project.texture)) {
        objects.set(name + "Texture", texture)
    }
}

// localization

export class Loc extends Value {
    constructor(name) {
        super()
        this.name = name
    }

    toString() {
        return project.locales[project.locale][this.name]
    }
}

export function loc(stringName) {
    return new Loc(stringName)
}

// listeners

document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas")
    let size = Math.min(document.body.clientWidth - 20, document.body.clientHeight - 20)
    canvas.height = size
    canvas.width = size
    canvas.focus()
    ctx = canvas.getContext("2d")
    ctx.font = canvas.width / 24 + "px monospace"
    ctx.textBaseline = "top"
    project.canvas = Canvas.create(16.0, 16.0, canvas.width, canvas.height)
    setCanvas(project.canvas)

    project._loadTextures()

    let imagesToLoad = textureSource.size
    textureSource.forEach((src, image) => {
        image.onload = () => {
            imagesToLoad--
            if(imagesToLoad <= 0) {
                project._init()
                project.modules.forEach(module => module._init())
                
                let apsTime = 0, realAps = 0, apsCounter = 0
                setInterval(function() {
                    project.actions.forEach(action => action.execute())
                    project._update()
                    project.modules.forEach(module => module._update())

                    for(const key of Object.values(project.key)) {
                        if(!(key instanceof Object)) continue
                        key._isPressed = false
                    }

                    let time = new Date().getTime()
                    if(time >= apsTime) {
                        realAps = apsCounter
                        apsTime = time + 1000
                        apsCounter = 0
                    } else {
                        apsCounter++
                    }
                }, 1000 / aps)

                let fpsTime = 0, realFps = 0, fpsCounter = 0
                setInterval(function() {
                    let time = new Date().getTime()
                    if(time >= fpsTime) {
                        realFps = fpsCounter
                        fpsTime = time + 1000
                        fpsCounter = 0
                    } else {
                        fpsCounter++
                    }
                    currentCanvas.draw()
                    ctx.fillStyle = "white"
                    ctx.fillText(`fps: ${realFps}, aps: ${realAps}` , 5, 5)
                }, 1000.0 / 60)
            }
        }
        image.src = src
    })
})

document.addEventListener("keydown", event => {
    switch (event.code) {
        case "KeyL":
            project.locale = project.locale === "ru" ? "en" : "ru"
            break
        case "KeyO":
            showCollisionShapes = !showCollisionShapes
            break
    }

    for(const key of Object.values(project.key)) {
        if(!(key instanceof Object)) continue
        if(event.code === key.code) {
            key._isDown = true
        }
    }
}, false)

document.addEventListener("keyup", event => {
    for(const key of Object.values(project.key)) {
        if(!(key instanceof Object)) continue
        if(event.code === key.code) {
            key._isDown = false
        }
    }
}, false)

document.addEventListener("keypress", event => {
    for(const key of Object.values(project.key)) {
        if(!(key instanceof Object)) continue
        if(event.code === key.code) {
            key._wasPressed = true
        }
    }
}, false)