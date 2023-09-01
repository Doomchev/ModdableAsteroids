import {Action, fpsk} from "../../system.js"

export default class Rotate extends Action {
    constructor(object, speed) {
        super()
        this.object = object
        this.speed = speed
    }

    execute() {
        this.object.rotate(this.speed * fpsk)
    }
}