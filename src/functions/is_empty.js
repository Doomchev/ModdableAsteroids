import {BooleanFunction} from "./boolean.js"

export default class IsEmpty extends BooleanFunction {
    constructor(layer) {
        super()
        this.layer = layer
    }

    toBoolean() {
        return this.layer.items.length === 0
    }
}