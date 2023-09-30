import {Function} from "./function.js"

export function createTree(element, object) {
    if(object.getString) {
        if(object.getItems) createTree(element, object.getItems())
    } else if(object instanceof Array) {
        object.forEach(item => {
            let div = document.createElement("div")
            div.innerText = getString(item)
            div.style.textAlign = "left"
            element.appendChild(div)

            let container = document.createElement("div")
            container.style.flexDirection = "column"
            container.style.marginLeft = "8px"
            container.style.textAlign = "left"
            createTree(container, item)
            element.appendChild(container)
        })
    } else if(object instanceof Object) {
        for(const[key, value] of Object.entries(object)) {
            if(key.startsWith("_")
                || (value instanceof Function)
                || (value === undefined))
                continue

            let div = document.createElement("div")
            div.style.textAlign = "left"
            div.innerText = (translate(key)) + ": " + getString(value)
            element.appendChild(div)

            let container = document.createElement("div")
            container.style.flexDirection = "column"
            container.style.textAlign = "left"
            container.style.marginLeft = "8px"
            createTree(container, value)
            element.appendChild(container)
        }
    }
}

let objectName = new Map()
let precision = 5

export function getString(object) {
    if(typeof object === 'string') {
        return "\"" + object + "\""
    }

    if(typeof object === 'number') {
        let string = object.toString()
        let dotPos = string.indexOf(".")
        if(dotPos >= 0) return string.substring(0, dotPos + precision)
    }

    if(!(object instanceof Object)) {
        return object
    }

    let name = objectName.get(object)
    if(name !== undefined) return translate(name)

    if(object instanceof HTMLImageElement) {
        return translate("Image")
    } else if(object.getString) {
        return object.getString()
    }

    return translate(object.constructor.name)
}

export function setName(object, name) {
    objectName.set(object, name)
    return object
}

let translations = new Map()
export function addTranslations(map) {
    for(const[key, value] of Object.entries(map)) {
        translations.set(key, value)
    }
}

export function translate(string) {
    let translation = translations.get(string)
    return translation ? translation : string
}