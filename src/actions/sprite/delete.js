import {Action, deleteFromArray} from "../../system.js"

export default class Delete extends Action {
    constructor(object, layer) {
        super()
        this.object = object
        this.layer = layer
    }

    execute() {
        deleteFromArray(this.layer.items, this.object.toSprite())
    }
}