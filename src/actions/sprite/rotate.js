import {Action, apsk, getValue} from "../../system.js"

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
        return new Rotate(this.object.toSprite(), getValue(this.speed, "speed"))
    }
}