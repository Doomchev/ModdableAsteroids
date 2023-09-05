import {Action} from "../../system.js"

export default class Clear extends Action {
    constructor(layer) {
        super()
        this.layer = layer
    }

    execute() {
        this.layer.items = []
    }
}