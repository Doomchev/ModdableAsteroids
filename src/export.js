import {Action, project} from "./system.js"
import SingleFunction from "./functions/single.js"
import {dv} from "./classes.js"

let text = "", indent = "", currentIndex = -1

export function exportProject() {
    for(let [name, object] of Object.entries(project)) {
        if(name === "data") continue
        if(object instanceof Function) continue

        text += `\r\n${name} = `
        if(!(object instanceof Object) || object instanceof Array) {
            exportValue(object)
        } else {
            exportObject(object)
        }
    }
    console.log(text)
}

function exportObject(object, attachId = false) {
    if(object._id) {
        text += `#${object._id}`
        return
    }

    let single = object instanceof Action || object instanceof SingleFunction

    if(!single) {
        if(object._name) {
            object._id = object._name
        } else {
            currentIndex++
            object._id = currentIndex
        }
    }

    let id = single ? "" : (attachId ? `(#${object._id})` : "")
    text += `${object.constructor.name}${id} {`
    indent += "\t"
    let hasValue = false
    for(const[key, value] of Object.entries(object)) {
        if(key.charAt(0) === "_" || value === undefined) continue
        let defValue = dv[key]
        if(defValue instanceof Array && value.length === 0) continue
        if(value === defValue) continue

        if(hasValue === false) {
            text += "\r\n"
            hasValue = true
        }
        text += `${indent}${key}: `
        exportValue(value)
        text += "\r\n"
    }
    indent = indent.substring(1)
    text += hasValue ? `${indent}}` : "}"
}

function exportValue(value) {
    if(value instanceof Array) {
        if(value.length === 0) {
            text += "[]"
            return
        }
        text += "[\r\n"
        indent += "\t"
        let first = true
        value.forEach(item => {
            if(first) {
                first = false
            } else {
                text += ", \r\n"
            }
            text += indent
            exportValue(item)
        })
        indent = indent.substring(1)
        text += `\r\n${indent}]`
    } else if(value instanceof HTMLImageElement) {
        if(value._id) {
            text += `#${value._id}`
        } else {
            value._id = `${value._name}Texture`
            text += `Texture(#${value._id}, \"${value.src}\")`
            if(!value._id) throw Error(`Texture ${value.src}`)
        }
    } else if(value instanceof Object) {
        exportObject(value, true)
    } else if(typeof value === 'string') {
        text += `"${value}"`
    } else {
        text += value
    }
}