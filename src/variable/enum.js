import {Value} from "../value.js"

export class EnumVariable extends Value {
    constructor(value) {
        super()
        this.value = value.toInt()
    }

    equateTo(value) {
        this.value = value.toInt()
    }

    toInt() {
        return this.value
    }
}