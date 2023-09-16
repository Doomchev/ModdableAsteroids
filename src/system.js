import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import {Value} from "./value.js"
import {modules, project, setModules} from "./project.js"
import {exportProject} from "./export.js"
import DefaultAsteroidCreation from "../mod/default_asteroid_creation.js"
import DefaultAsteroidDestruction from "../mod/default_asteroid_destruction.js"
import MultiExplosion from "../mod/multi_explosion.js"
import AsteroidsPerimeter from "../mod/asteroids_perimeter.js"
import AsteroidPieces from "../mod/asteroid_pieces.js"
import ExtraLifeBonus from "../mod/extra_life_bonus.js"
import BonusForLevel from "../mod/bonus_for_level.js"
import InfiniteLives from "../mod/infinite_lives.js"
import DefaultExplosion from "../mod/default_explosion.js"
import CameraMovement from "../mod/camera_movement.js"

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

export function rndi(from, to) {
    return Math.floor(rnd(from, to))
}

export function rnd(from = 1, to) {
    return to === undefined ? Math.random() * from : Math.random() * (to - from) + from
}

export function randomSign() {
    return 2 * rndi(2) - 1
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

// sound

export function loopedSound(name, loopStart, loopEnd, play) {
    let sound = new Audio(project.sound[name])
    let loopLength = loopEnd - loopStart
    setInterval(function() {
        if(sound.currentTime > loopEnd) sound.currentTime += loopStart - loopLength
    }, 50)
    if(play) sound.play()
    return sound
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
    let allModules = [
        [new DefaultAsteroidCreation(), true],
        [new AsteroidsPerimeter(), true],
        [new DefaultAsteroidDestruction(), true],
        [new AsteroidPieces(), true],
        [new DefaultExplosion(), false],
        [new MultiExplosion(), true],
        [new CameraMovement(), false],
        [new ExtraLifeBonus(25000), true],
        [new BonusForLevel(1000), true],
        [new InfiniteLives(), false],
    ]

    let mods = document.getElementById("mods"), div
    allModules.forEach(module => {
        div = document.createElement("div")

        let checkbox = document.createElement("input")
        let moduleObject = module[0]

        checkbox.type = "checkbox"
        checkbox.name = moduleObject.constructor.name
        checkbox.checked = module[1]
        checkbox.module = moduleObject

        div.appendChild(checkbox)

        let label = document.createElement("label")
        label.for = moduleObject.constructor.name
        label.textContent = moduleObject.name
        div.appendChild(label)

        mods.appendChild(div)
    })

    document.getElementById("start").onclick = function ()  {
        for(let div of mods.childNodes) {
            let element = div.childNodes[0]
            if (element?.module && element.checked) modules.push(element.module)
        }
        mods.style.display = "none"

        let canvas = document.getElementById("canvas")
        canvas.hidden = false
        let size = Math.min(document.body.clientWidth - 20, document.body.clientHeight - 20)
        canvas.height = size
        canvas.width = size
        canvas.focus()
        ctx = canvas.getContext("2d")
        ctx.font = canvas.width / 24 + "px monospace"
        ctx.textBaseline = "top"
        project.canvas = Canvas.create(16.0, 16.0, canvas.width, canvas.height)
        setCanvas(project.canvas)

        project.loadTextures()

        let imagesToLoad = textureSource.size
        textureSource.forEach((src, image) => {
            image.onload = () => {
                imagesToLoad--
                if (imagesToLoad <= 0) {
                    project.init()
                    modules.forEach(module => module.init())
                    exportProject()

                    let apsTime = 0, realAps = 0, apsCounter = 0
                    setInterval(function () {
                        project.actions.forEach(action => action.execute())
                        project.update()
                        modules.forEach(module => {
                            module.actions.forEach(action => action.execute())
                            module.update()
                        })

                        for (const key of Object.values(project.key)) {
                            if (!(key instanceof Object)) continue
                            key._wasPressed = false
                        }

                        let time = new Date().getTime()
                        if (time >= apsTime) {
                            realAps = apsCounter
                            apsTime = time + 1000
                            apsCounter = 0
                        } else {
                            apsCounter++
                        }
                    }, 1000 / aps)

                    let fpsTime = 0, realFps = 0, fpsCounter = 0
                    setInterval(function () {
                        let time = new Date().getTime()
                        if (time >= fpsTime) {
                            realFps = fpsCounter
                            fpsTime = time + 1000
                            fpsCounter = 0
                        } else {
                            fpsCounter++
                        }
                        currentCanvas.draw()

                        ctx.fillStyle = "white"
                        //ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
                    }, 1000.0 / 60)
                }
            }
            image.src = src
        })
    }
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
            if(!key._isDown) {
                key._wasPressed = true
            }
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