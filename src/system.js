import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import FloatFunction from "./functions/float.js"
import Sprite from "./sprite.js"
import SpriteVariable, {SpriteFunction} from "./variable/sprite.js"
import {Value} from "./value.js"
import IntFunction from "./functions/int.js"

export let project = {
    textures: {},
    loc: "ru",
    loadTextures: undefined,
    init: undefined,
    data: undefined,
    keys: [],
    scene: [],
    actions: [],
}

// basic classes

export class Action {
    execute() {}
    copy() {return {}}
}

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

export function removeFromArray(item, array) {
    let i = array.indexOf(item)
    if(i < 0) return
    array.splice(i, 1)
}

export function getValue(object, fieldName) {
    if(typeof object === "number") {
        return object
    }
    if(object instanceof IntFunction) {
        return object.toInt()
    }
    if(object instanceof FloatFunction) {
        return object.toFloat()
    }
    if(object instanceof SpriteFunction || object instanceof Sprite) {
        return object.toSprite()[fieldName]
    }
    if(object) {
        return getValue(object[fieldName])
    }
    return undefined
}

// code, collisions

export function executeCode(code) {
    if(code instanceof Array) {
        code.forEach(item => item.execute())
    } else {
        code.execute()
    }
}

export let collisionSprite1 = new SpriteVariable("collisionSprite1")
export let collisionSprite2 = new SpriteVariable("collisionSprite2")

export function executeCollisionCode(sprite1, sprite2, code) {
    collisionSprite1.sprite = sprite1
    collisionSprite2.sprite = sprite2
    executeCode(code)
}

// textures

let textureSource = new Map()
export function addTextures(textureMap) {
    for(let [name, src] of Object.entries(textureMap)) {
        let texture = new Image();
        texture._name = name
        textureSource.set(texture, src)
        project.textures[name] = texture
    }
}

export function addTexturesToObjects(objects) {
    for(let [name, texture] of Object.entries(project.textures)) {
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
        return project[project.loc][this.name]
    }
}

export function loc(stringName) {
    return new Loc(stringName)
}

// listeners

document.addEventListener("DOMContentLoaded", function() {
    let bodyHeight = document.body.clientHeight - 20
    let canvas = document.getElementById("canvas")
    canvas.height = bodyHeight
    canvas.width = bodyHeight * 9.0 / 16.0
    canvas.focus()
    ctx = canvas.getContext("2d")
    ctx.font = canvas.width / 24 + "px monospace"
    ctx.textBaseline = "top"
    project.canvas = Canvas.create(9.0, 16.0, canvas.width, canvas.height)
    setCanvas(project.canvas)

    project.loadTextures()

    let imagesToLoad = textureSource.size
    textureSource.forEach((src, image) => {
        image.onload = () => {
            imagesToLoad--
            if(imagesToLoad <= 0) {
                project.init()
                
                let apsTime = 0, realAps = 0, apsCounter = 0
                setInterval(function() {
                    project.actions.forEach(module => module.execute())
                    project.keys.forEach(key => key._isPressed = false)
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
            project.loc = project.loc === "ru" ? "en" : "ru"
            break
        case "KeyO":
            showCollisionShapes = !showCollisionShapes
            break
    }

    project.keys.forEach(key => {
        if(event.code === key.code) {
            key._isDown = true
        }
    })
}, false)

document.addEventListener("keyup", event => {
    project.keys.forEach(key => {
        if(event.code === key.code) {
            key._isDown = false
        }
    })
}, false)

document.addEventListener("keypress", event => {
    project.keys.forEach(key => {
        if(event.code === key.code) {
            key._isPressed = true
        }
    })
}, false)