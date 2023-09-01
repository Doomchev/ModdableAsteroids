import {Action, executeCode} from "../../system.js"
import Layer from "../../layer.js"
import {current} from "../../variable.js"

export default class ExecuteLogic extends Action {
    constructor(object) {
        super()
        this.object = object
    }

    executeActions(sprite) {
        current.sprite = sprite
        sprite.actions.forEach(command => command.execute())
    }

    execute() {
        if(this.object instanceof Layer) {
            this.object.items.forEach(item => this.executeActions(item))
        } else {
            this.executeActions(this.object.toSprite())
        }
    }
}