import {Loc} from "./system.js"
import {dv} from "./classes.js"
import {Action} from "./actions/action.js"
import {project} from "./project.js"
import Shape from "./shape.js"
import "./russian.js"

let text = "", indent = "", currentIndex = -1

export function exportProject() {
    for(let [name, object] of Object.entries(project)) {
        if(name.startsWith("_")) continue
        if(object instanceof Function) continue

        text += `\r\n${name}: `
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

    let single = object instanceof Action

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
    let isShape = object instanceof Shape
    for(const[key, value] of Object.entries(object)) {
        if(key.startsWith("_") || value === undefined) continue
        if(value instanceof Function) continue

        let defValue = dv[key]
        if(defValue instanceof Array && value.length === 0) continue
        if(value === defValue) continue

        if(hasValue === false) {
            text += "\r\n"
            hasValue = true
        }
        if(isShape) {
            switch (key) {
                case "halfWidth":
                    text += `${indent}width: ${2 * value}`
                    break
                case "halfHeight":
                    text += `${indent}height: ${2 * value}`
                    break
                case "angle":
                case "imageAngle":
                    text += `${indent}${key}: ${180 * value / Math.PI}`
                    break
                default:
                    text += `${indent}${key}: `
                    exportValue(value)
            }
        } else {
            text += `${indent}${key}: `
            exportValue(value)
        }
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
            text += `Texture(\"${value.src.substring(value.src.indexOf("/textures/") + 1)}\")`
            if(!value._id) throw Error(`Texture ${value.src}`)
        }
    } else if(value instanceof Loc) {
        text += `Loc(${value.name})`
    } else if(value instanceof Object) {
        exportObject(value, true)
    } else if(typeof value === 'string') {
        text += `"${value}"`
    } else {
        text += value
    }
}