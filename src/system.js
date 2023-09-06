import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import FloatFunction from "./functions/float.js"
import Sprite from "./sprite.js"
import SpriteVariable, {SpriteFunction} from "./variable/sprite.js"

export let project = {}

// basic classes

export class Action {
    execute() {}
    copy() {return {}}
}

// global variables

export let zk = 1.2, fps = 144.0, aps = 200.0, showCollisionShapes = false
export let ctx, mousesx, mousesy, apsk = 1.0 / aps

export let root = {
    keys: [],
    scene: [],
    actions: []
}

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

export function removeFromArray(item, array) {
    let i = array.indexOf(item)
    if(i < 0) return
    array.splice(i, 1)
}

export function getValue(object, fieldName) {
    if(typeof object === "number") {
        return object
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

// textures

let textureSource = new Map()
export let textures = {}
export function addTextures(textureMap) {
    for(let [name, src] of Object.entries(textureMap)) {
        let texture = new Image();
        texture._name = name
        textureSource.set(texture, src)
        textures[name] = texture
    }
}

export function addTexturesToObjects(objects) {
    for(let [name, texture] of Object.entries(textures)) {
        objects.set(name + "Texture", texture)
    }
}

// listeners

document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas")
    canvas.focus()
    ctx = canvas.getContext("2d")
    root.canvas = Canvas.create(0, 0, canvas.clientWidth, canvas.clientHeight, 40.0)
    setCanvas(root.canvas)

    project.loadTextures()

    let imagesToLoad = textureSource.size
    textureSource.forEach((src, image) => {
        image.onload = () => {
            imagesToLoad--
            if(imagesToLoad <= 0) {
                project.init()
                
                let apsTime = 0, realAps = 0, apsCounter = 0
                setInterval(function() {
                    root.actions.forEach(module => module.execute())
                    root.keys.forEach(key => key._isPressed = false)
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
                    ctx.font = "12px serif";
                    ctx.fillStyle = "white"
                    ctx.fillText(`fps: ${realFps}, aps: ${realAps}` , 5, 5)
                })
            }
        }
        image.src = src
    })
})

document.addEventListener("keydown", event => {
    if(event.code === "F9") showCollisionShapes = !showCollisionShapes
    root.keys.forEach(key => {
        if(event.code === key.code) {
            key._isDown = true
        }
    })
}, false)

document.addEventListener("keyup", event => {
    root.keys.forEach(key => {
        if(event.code === key.code) {
            key._isDown = false
        }
    })
}, false)

document.addEventListener("keypress", event => {
    root.keys.forEach(key => {
        if(event.code === key.code) {
            key._isPressed = true
        }
    })
}, false)