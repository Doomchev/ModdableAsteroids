import {Action, apsk} from "../../system.js"

export default class Rotate extends Action {
    constructor(object, speed) {
        super()
        this.object = object
        this.speed = speed
    }

    execute() {
        this.object.toSprite().rotate(this.speed * apsk)
    }

    copy() {
        return new Rotate(this.object, this.speed)
    }
}