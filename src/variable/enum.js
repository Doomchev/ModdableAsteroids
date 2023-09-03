import {Value} from "../value.js"

export class EnumVariable extends Value {
    constructor(value) {
        super()
        this.value = value
    }

    equateTo(value) {
        this.value = value instanceof Value ? value.toInt() : value
    }

    toInt() {
        return this.value
    }
}