import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import {Function} from "./function.js"
import {mod, project} from "./project.js"
import {exportProject} from "./export.js"
import {createTree, notExpandedKeys, setName, treeInit} from "./tree.js"
import ImageArray from "./image_array.js"

// global variables

export let zk = 1.2, fps = 60, aps = 150, showCollisionShapes = false, paused = false
export let ctx, mousesx, mousesy, apsk = 1 / aps

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
    return Math.PI * angle / 180
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
    if(value === undefined) return undefined
    return typeof value === "number" ? value : value.toNumber()
}

export function togglePause() {
    paused = !paused
}

// sound

export let masterVolume = 0.25

export function playSound(sound) {
    let newSound = new Audio(sound.src)
    newSound.volume = masterVolume
    newSound.play()
}

export function loopedSound(sound, loopStart, loopEnd, play) {
    let newSound = new Audio(sound.src)
    let loopLength = loopEnd - loopStart
    setInterval(function() {
        if(newSound.currentTime > loopEnd) newSound.currentTime -= loopLength
    }, 5)
    if(play) newSound.play()
    newSound.volume = masterVolume
    return newSound
}

// localization

export class Loc extends Function {
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

// assets loader

let assetsToLoad = 0
export function loadAssets(path, asset) {
    let textures = {}

    for(const[key, value] of Object.entries(asset.texture)) {
        let texture = new Image()
        texture.onload = () => {
            assetsToLoad--
            if(assetsToLoad <= 0) start()
        }
        texture.src = path + value
        textures[key] = texture
        setName(texture, value)
        assetsToLoad++
    }

    function addAudioListener(audio) {
        let listener = () => {
            assetsToLoad--
            audio.removeEventListener("canplaythrough", listener, false)
            if (assetsToLoad <= 0) start()
        }
        audio.addEventListener("canplaythrough", listener, false);
    }

    let sounds = {}
    for(const[key, value] of Object.entries(asset.sound)) {
        let audio = new Audio()
        addAudioListener(audio)
        audio.src = path + value
        setName(audio, value)
        sounds[key] = audio
        assetsToLoad++
    }

    return {texture: textures, sound: sounds}
}

// listeners

let square = true
document.addEventListener("DOMContentLoaded", function() {
    project.allModules.forEach(module => {
        setName(module, module.constructor.name)
        module[0]._path ??= module[2]
        if (module[1]) mod.push(module[0])
    })

    let canvas = document.getElementById("canvas")
    if(square) {
        canvas.width = canvas.height = 640
    } else {
        canvas.width = 360
    }
    canvas.focus()

    ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.font = canvas.width / 24 + "px monospace"
    ctx.textBaseline = "top"
    project.canvas = Canvas.create(square ? 16 : 9, 16, canvas.width, canvas.height)
    setCanvas(project.canvas)

    project._assets = loadAssets("", project.getAssets())
    project.sound = project._assets.sound
    mod.forEach(module => {
        module._assets = loadAssets(module._path, module.getAssets())
        if(Object.keys(module._assets.sound).length > 0) module.sound = module._assets.sound
    })
})

function start() {
    project.init(project._assets.texture)
    delete project._assets

    mod.forEach(module => {
        module.init(module._assets.texture)
        delete module._assets
    })
    //exportProject()

    let projectDiv = document.getElementById("project")
    treeInit()
    createTree(projectDiv, project.registry)
    createTree(projectDiv, mod)

    let apsTime = 0, realAps = 0, apsCounter = 0
    setInterval(function () {
        if(paused) {
            project.update()
        } else {
            project.actions.forEach(action => action.execute())
            project.update()
            mod.forEach(module => {
                module._actions.forEach(action => action.execute())
                module.update()
            })
        }

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
        mod.forEach(module => module.draw())

        //ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
    }, 1000.0 / 150)
}

document.addEventListener("keydown", event => {
    //event.preventDefault();

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