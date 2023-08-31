import {Executable, fpsk} from "../../system.js"

export default class Rotate extends Executable {
    constructor(object, speed) {
        super()
        this.object = object
        this.speed = speed
    }

    execute() {
        this.object.rotate(this.speed * fpsk)
    }
}