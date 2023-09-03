import {Value} from "../../value.js"

export default class IsEmpty extends Value {
    constructor(layer) {
        super()
        this.layer = layer
    }

    toBoolean() {
        return this.layer.items.length === 0
    }
}