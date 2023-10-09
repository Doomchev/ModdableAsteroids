export let notExpandedKeys = new Set()

export function treeInit() {
    notExpandedKeys.add("type")
    notExpandedKeys.add("currentWeapon")
}

function objectDiv(element, text, object, isLast, showContents = true) {
    let iconPos = isLast ? "36px 36px" :  "36px -18px"

    let div = document.createElement("div")
    div.style.display = "flex"
    div.style.flexDirection = "row"
    element.appendChild(div)

    if(showContents) {
        let container = document.createElement("div")
        container.style.display = "flex"
        container.style.flexDirection = "row"

        let line = document.createElement("div")
        if(!isLast) line.style.background = "url(./src/icons/line.png)"
        line.style.width = "9px"
        line.style.flexShrink = "0"
        container.appendChild(line)

        let items = document.createElement("div")
        items.style.flexDirection = "column"
        items.style.textAlign = "left"
        iconPos = createTree(items, object, isLast)
        container.appendChild(items)
        element.appendChild(container)
    }

    let button = document.createElement("div")
    button.style.background = "url(./src/icons/tree.png)"
    button.style.backgroundSize = "18"
    button.style.backgroundPosition = iconPos
    button.style.width = "18px"
    button.style.height = "18px"
    div.appendChild(button)

    let textDiv = document.createElement("div")
    textDiv.innerText = text
    textDiv.style.textAlign = "left"
    div.appendChild(textDiv)
}

export function createTree(element, object, isLast) {
    if(object.getString) {
        if(object.getItems) {
            let array = object.getItems()
            createTree(element, array)
            if(array.length === 0) return isLast ? "0px 36px" : "0px -18px"
            return isLast ? "0px 36px" : "18px 54px"
        }
    } else if(object instanceof Array) {
        if(object.length === 0) return isLast ? "0px 36px" : "0px -18px"

        for(let i = 0; i < object.length; i++) {
            let item = object[i]
            objectDiv(element, getString(item), item, i === object.length - 1)
        }
        return isLast ? "18px 36px" : "18px 54px"
    } else if(object instanceof Object) {
        let empty = true
        let entries = Object.entries(object)
        for(let i = 0; i < entries.length; i++) {
            let entry = entries[i]
            let key = entry[0]
            let value = entry[1]
            if(key.startsWith("_")
                || (typeof value === 'function')
                || (value === undefined))
                continue
            objectDiv(element, translate(key) + ": " + getString(value), value, i === entries.length - 1
                , !notExpandedKeys.has(key))
            empty = false
        }
        if(empty) return isLast ? "0px 36px" :  "0px -18px"
        return isLast ? "18px 36px" : "18px 54px"
    }
    return isLast ? "0px 36px" : "0px -18px"
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
    object.name = name
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