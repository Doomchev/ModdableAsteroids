import Canvas, {currentCanvas, setCanvas} from "./canvas.js"
import {Function} from "./function.js"
import {mod, project} from "./project.js"
import {exportProject} from "./export.js"

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

// assets

let assetSource = new Map()
let assetPath = ""

// textures

export function loadTexture(src) {
    let texture = new Image();
    assetSource.set(texture, assetPath + src)
    return texture
}

// sound

export let masterVolume = 0.25

export function loadSound(src) {
    let sound = new Audio()
    assetSource.set(sound, assetPath + src)
    return sound
}

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

// listeners

document.addEventListener("DOMContentLoaded", function() {
    let mods = document.getElementById("mods"), div
    project.allModules.forEach(module => {
        div = document.createElement("div")

        let checkbox = document.createElement("input")
        let moduleObject = module[0]

        checkbox.type = "checkbox"
        checkbox.name = moduleObject.constructor.name
        checkbox.checked = module[1]
        checkbox.module = moduleObject
        moduleObject.path = module.length < 3 ? "" : module[2]

        div.appendChild(checkbox)

        let label = document.createElement("label")
        label.for = moduleObject.constructor.name
        label.textContent = moduleObject.name
        div.appendChild(label)

        mods.appendChild(div)
    })

    let assetsToLoad = 0
    document.getElementById("start").onclick = function ()  {
        for(let div of mods.childNodes) {
            let element = div.childNodes[0]
            if (element?.module && element.checked) mod.push(element.module)
        }
        mods.style.display = "none"

        let square = true

        let body = document.body
        let canvas = document.getElementById("canvas")
        canvas.hidden = false
        if(square) {
            let size = Math.min(body.clientWidth - 20, body.clientHeight - 20)
            canvas.width = canvas.height = size
        } else {
            canvas.width = 360
            canvas.height = 640
            body.style.flexDirection = ""
        }
        canvas.focus()
        ctx = canvas.getContext("2d")
        ctx.fillStyle = "white"
        ctx.font = canvas.width / 24 + "px monospace"
        ctx.textBaseline = "top"
        project.canvas = Canvas.create(square ? 16 : 9, 16, canvas.width, canvas.height)
        setCanvas(project.canvas)

        project.loadAssets()
        mod.forEach(module => {
            assetPath = module.path
            if(module.loadAssets) module.loadAssets()
        })
        assetPath = "=error="

        assetsToLoad = assetSource.size
        assetSource.forEach((src, asset) => {
            if(asset instanceof Audio) {
                addAudioListener(asset)
            } else {
                asset.onload = () => {
                    assetsToLoad--
                    if (assetsToLoad <= 0) start()
                }
            }
            asset.src = src
        })
    }

    function addAudioListener(audio) {
        let listener = () => {
            assetsToLoad--
            audio.removeEventListener("canplaythrough", listener, false)
            if (assetsToLoad <= 0) start()
        }
        audio.addEventListener("canplaythrough", listener, false);
    }
})

function start() {
    project.init()
    mod.forEach(module => module.init())
    exportProject()

    let apsTime = 0, realAps = 0, apsCounter = 0
    setInterval(function () {
        if(paused) {
            project.update()
        } else {
            project.actions.forEach(action => action.execute())
            project.update()
            mod.forEach(module => {
                module.actions.forEach(action => action.execute())
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