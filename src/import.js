// noinspection ES6UnusedImports

import Image from "./image.js"
import Sprite from "./sprite.js"
import Key from "./key.js"
import {align, collisionSprite1, collisionSprite2, root} from "./system.js"
import LinearChange from "./actions/linear_change.js"
import Move from "./actions/sprite/move.js"
import If from "./actions/structure/if.js"
import ImageArray from "./image_array.js"
import Constraint from "./constraint.js"
import Animate from "./actions/sprite/animate.js"
import SetField from "./actions/set_field.js"
import Layer from "./layer.js"
import Create from "./actions/sprite/create.js"
import Delayed from "./actions/delayed.js"
import {currentCanvas} from "./canvas.js"
import SetBounds from "./actions/sprite/set_bounds.js"
import LoopArea from "./actions/sprite/loop_area.js"
import Shape from "./shape.js"
import ExecuteActions from "./actions/sprite/execute_actions.js"
import Rotate from "./actions/sprite/rotate.js"
import OnCollision from "./actions/sprite/on_collision.js"
import Remove from "./actions/sprite/remove.js"
import DelayedRemove from "./actions/sprite/delayed_remove.js"
import IsEmpty from "./functions/is_empty.js"
import AddAction from "./actions/sprite/add_action.js"
import Repeat from "./actions/structure/repeat.js"
import Label from "./gui/label.js"
import {current} from "./variable/sprite.js"
import IntVariable from "./variable/int.js"
import Increment from "./actions/variable/increment.js"
import EnumVariable from "./variable/enum.js"
import IntIsEqual from "./functions/equal.js"
import Equate from "./actions/variable/int_equate.js"
import RandomFloat from "./functions/random_float.js"
import RandomSign from "./functions/random_sign.js"
import Mul from "./functions/mul.js"
import Pressed from "./functions/pressed.js"
import Decrement from "./actions/variable/decrement.js"
import Add from "./actions/variable/add.js"
import Empty from "./actions/layer/empty.js"
import SpriteVariable, {SpriteFunction} from "./variable/sprite.js"
import {data} from "../data.js"
import {texture} from "../asteroids.js"

let log = true
let pos = 0, objects = {}, logText = ""

export function importFromEon() {
    while (true) {
        let name = readId()
        if(name === "") return

        if(log) logText += " "
        expect("=")
        if(log) logText += " "

        if(name === "root") readObject(root)

        if(log) logText += "\r\n"
    }
}

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
    }

    if(name.startsWith("#")) return objects[name.substring(1)]

    let link = ""
    if(readSymbol() === "(") {
        expect("(")
        link = readId().substring(1)
    }

    if(name === "Texture") {
        expect(",")
        if (log) logText += " "
        object = readValue()
        expect(")")
        texture[link.replace("Texture", "")] = object
        return object
    }

    if(object === undefined) object = Object.create(eval(name))
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
        object[name] = readValue()
    }
    if(log) logText += "}"
    pos++

    if(link !== "") objects[link] = object
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
            return objects[readId().substring(1)]
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