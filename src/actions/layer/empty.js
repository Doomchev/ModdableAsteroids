import {Action} from "../../system.js"

export default class Empty extends Action {
    constructor(layer) {
        super()
        this.layer = layer
    }

    execute() {
        this.layer.items = []
    }
}