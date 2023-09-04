import {Value} from "../value.js"

export class EnumVariable extends Value {
    constructor(value) {
        super()
        this._value = value
    }

    equateTo(value) {
        this._value = value instanceof Value ? value.toInt() : value
    }

    toInt() {
        return this._value
    }
}