import {addTextures, addTexturesToObjects, collisionSprite1, collisionSprite2, Loc, project} from "./system.js"
import {setCurrentCanvas} from "./canvas.js"
import {classes} from "./classes.js"
import {current} from "./variable/sprite.js"

let log = true
let pos = 0, objects = new Map(), logText = "", data

export function importTextures() {
    data = project.data

    readId()
    expect("=")
    addTextures(readValue())
}

export function importProject() {
    objects.clear()
    objects.set("current", current)
    objects.set("collisionSprite1", collisionSprite1)
    objects.set("collisionSprite2", collisionSprite2)

    addTexturesToObjects(objects)

    while(true) {
        let name = readId()
        if(name === "") break

        if(log) logText += " "
        expect("=")
        if(log) logText += " "

        project[name] = readValue()
        if(name === "textures") {
            addTexturesToObjects(objects)

        }

        if(log) logText += "\r\n"
    }
    setCurrentCanvas(project.canvas)
}

// checking

function isDigit(symbol) {
    return (symbol >= "0" && symbol <= "9")
}

function isLetter(symbol) {
    return (symbol >= "a" && symbol <= "z") || (symbol >= "A" && symbol <= "Z")
}

function isIdSymbol(symbol) {
    return isDigit(symbol) || isLetter(symbol) || symbol === "#"
}

function expect(symbol) {
    if(readSymbol() !== symbol) {
        console.log(logText)
        throw new Error(`${symbol} expected`)
    }
    if(log) logText += symbol
    pos++
}

// readers

function readSymbol() {
    while(true) {
        let char = data.charAt(pos)
        switch (char) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
                break
            default:
                return char
        }
        pos++
        if(pos >= data.length) return ""
    }
}

function readId() {
    if(readSymbol() === "") return ""
    let start = pos
    while(isIdSymbol(data.charAt(pos))) {
        pos++
    }
    if(log) logText += data.substring(start, pos)
    return data.substring(start, pos)
}

function readObject(object) {
    let name = readId()
    switch (name) {
        case "true": return true
        case "false": return false
        case "null": return null
        case "Loc":
            expect("(")
            let name = readId()
            expect(")")
            return new Loc(name)
        case "Texture":
            expect("(")
            readId()
            expect(",")
            if (log) logText += " "
            let src = readValue()
            expect(")")
            return src
    }

    if(name.startsWith("#")) return objects[name.substring(1)]

    let link = ""
    if(readSymbol() === "(") {
        expect("(")
        link = readId().substring(1)
    }

    let map = object ?? {}
    if(link !== "") expect(")")
    if(log) logText += " "
    expect("{")

    let first = true
    while(readSymbol() !== "}") {
        if (log) {
            if (first) {
                first = false
            } else {
                logText += "; "
            }
        }
        let name = readId()
        expect(":")
        if(log) logText += " "
        map[name] = readValue()
    }
    if(log) logText += "}"
    pos++

    object = object ?? classes[name](map)
    if(link !== "") {
        objects.set(link, object)
        object._name = link
    }
    return object
}

function readValue() {
    let firstSymbol = readSymbol()
    switch (firstSymbol) {
        case "[":
            expect("[")
            let array = []
            while(readSymbol() !== "]") {
                array.push(readValue())
                if(readSymbol() === ",") {
                    if(log) logText += " "
                    pos++
                }
            }
            expect("]")
            return array
        case "#":
            return objects.get(readId().substring(1))
        case "\"":
            pos++
            let start = pos
            while(data.charAt(pos) !== "\"") {
                pos++
            }
            pos++
            if(log) logText += "\"" + data.substring(start, pos)
            return data.substring(start, pos - 1)
    }

    if(isDigit(firstSymbol) || firstSymbol === "-") {
        let start = pos
        pos++
        while(isDigit(data.charAt(pos)) || data.charAt(pos) === "." ) {
            pos++
        }
        if(log) logText += data.substring(start, pos)
        return parseFloat(data.substring(start, pos))
    }
    return readObject()
}