import {Value} from "../value.js"

export default class EnumVariable extends Value {
    constructor(value) {
        super()
        this.value = value
    }
}