import {Function} from "./function.js"

export function createTree(element, object) {
    if(object.getString) {

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
            div.innerText = key + ": " + getString(value)
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

export function getString(object) {
    if(!(object instanceof Object) || object instanceof String) {
        return object
    } else if(object instanceof HTMLImageElement) {
        return "Image"
    } else if(object.getString) {
        return object.getString()
    }
    return object.constructor.name
}