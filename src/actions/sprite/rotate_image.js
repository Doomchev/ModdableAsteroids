import {Action, apsk, getValue, num} from "../../system.js"

export default class RotateImage extends Action {
    constructor(object, speed) {
        super()
        this.object = object
        this.speed = num(speed)
    }

    execute() {
        this.object.toSprite().turnImage(this.speed * apsk)
    }

    copy() {
        return new RotateImage(this.object.toSprite(), getValue(this.speed, "speed"))
    }
}