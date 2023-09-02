import {Action} from "../../system.js"
import {Value} from "../../value.js"

export default class Empty extends Value {
    constructor(layer) {
        super()
        this.layer = layer
    }

    get boolean() {
        return this.layer.items.length === 0
    }
}