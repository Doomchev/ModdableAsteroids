import {Action, removeFromArray} from "../../system.js"

export default class Remove extends Action {
    constructor(object, layer) {
        super()
        this.object = object
        this.layer = layer
    }

    execute() {
        removeFromArray(this.object.toSprite(), this.layer.items)
    }
}