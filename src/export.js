import {Action, root} from "./system.js"
import SingleFunction from "./functions/single.js"
import {texture} from "../asteroids.js"

let text = "", indent = "", currentIndex = -1

export function exportToConsole() {
    text = "texture = "
    exportValue(texture)
    text += "\r\nroot = "
    exportObject(root)
    console.log(text)
}

export function exportObject(object) {
    if(object._num) {
        text += `#${object._num}`
        return
    }

    let single = object instanceof Action || object instanceof SingleFunction

    if(!single) {
        currentIndex++
        object._num = currentIndex
    }

    let id = single ? "" : `(${currentIndex})`
    text += `${object.constructor.name}${id} {`
    indent += "  "
    let hasValue = false
    for(const[key, value] of Object.entries(object)) {
        if(key.charAt(0) === "_" || value === undefined) continue
        if(hasValue === false) {
            text += "\r\n"
            hasValue = true
        }
        text += `${indent}${key}: `
        exportValue(value)
        text += "\r\n"
    }
    indent = indent.substring(2)
    text += hasValue ? `${indent}}` : "}"
}

export function exportValue(value) {
    if(value instanceof Array) {
        if(value.length === 0) {
            text += "[]"
            return
        }
        text += "[\r\n"
        indent += "  "
        let first = true
        value.forEach(value2 => {
            if(first) {
                first = false
            } else {
                text += ", \r\n"
            }
            text += indent
            exportValue(value2)
        })
        indent = indent.substring(2)
        text += `\r\n${indent}]`
    } else if(value instanceof HTMLImageElement) {
        if(value._num) {
            text += `#${value._num}`
        } else {
            currentIndex++
            value._num = currentIndex
            text += `Texture(${currentIndex}, ${value.src})`
        }
    } else if(value instanceof Object) {
        exportObject(value)
    } else if(typeof value === 'string') {
        text += `"${value}"`
    } else {
        text += value
    }
}