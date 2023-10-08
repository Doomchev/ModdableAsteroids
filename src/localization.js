import {Function} from "./function.js"
import {project} from "./project.js"

export let locale = "en"
export let locales = {}

export class Loc extends Function {
    constructor(name) {
        super()
        this.name = name
    }

    toString() {
        return locales[locale][this.name]
    }
}

export function loc(stringName) {
    return new Loc(stringName)
}

export function setLocale(newLocale) {
    locale = newLocale
}