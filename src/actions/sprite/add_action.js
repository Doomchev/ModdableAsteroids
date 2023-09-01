import {Action} from "../../system.js"

export default class AddAction extends Action {
    constructor(object, action) {
        super()
        this.object = object
        this.action = action
    }

    execute() {
        this.object.toSprite().actions.push(this.action)
    }
}