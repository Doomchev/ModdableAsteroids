import {dv} from "./classes.js"
import {Action} from "../src/actions/action.js"
import {project} from "../src/project.js"
import Shape from "../src/shape.js"
import "./russian.js"
import {Loc} from "../src/system.js"

let text = "", indent = "", currentIndex = -1
export let objectId = new Map()

export function exportProject() {
    text = "let project = "
    exportObject(project)
    console.log(text)
}

function exportObject(object, attachId = false) {
    let id = objectId.get(object)
    if(id !== undefined) {
        text += `"#${id}"`
        return
    }

    let single = object instanceof Action

    if(!single) {
        if(object._name) {
            id = object._name
        } else {
            currentIndex++
            id = `object${currentIndex}`
        }
        objectId.set(object, id)
    }

    if(object.toJSON) {
        text += object.toJSON()
        return
    }

    //text += `${object.constructor.name}()`
    text += "{"
    indent += "\t"
    if(!single) text += `\r\n${indent}id: "${id}"`
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
    } else if(value instanceof Image) {
        let id = objectId[value]
        if(id) {
            text += `#${id}`
        } else {
            objectId[value] = `${value._name}Texture`
            text += textureToJSON(value)
        }
    } else if(value instanceof Audio) {
        let id = objectId[value]
        if(id) {
            text += `#${id}`
        } else {
            objectId[value] = `${value.name}`
            text += soundToJSON(value)
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

export function toJSON(object) {
    if(object instanceof Object) return object.toJSON()
    return object
}

export function textureToJSON(texture) {
    if(texture) return (`new Image(${texture.src})`)
    return "undefined"
}

export function soundToJSON(sound) {
    if(sound) return (`new Audio(${sound.src})`)
    return "undefined"
}