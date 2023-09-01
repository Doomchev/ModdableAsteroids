import {Action} from "../../system.js"

export default class SetAngle extends Action {
    constructor(object, asObject) {
        super()
        this.object = object
        this.asObject = asObject
    }

    execute() {
        this.object.toSprite().angle = this.asObject.toSprite().angle
    }
}