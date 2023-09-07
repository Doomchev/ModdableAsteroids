import {Value} from "./value.js"
import {project} from "./system.js"

export default class Key extends Value {
    constructor(name, code) {
        super()
        if(name) this._name = name
        this.code = code
        this._isPressed = false
        this._isDown = false
        project.keys.push(this)
    }

    toBoolean() {
        return this._isDown
    }
}