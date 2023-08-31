import {Executable} from "../../system.js"

export default class SetAngle extends Executable {
    constructor(object, asObject) {
        super()
        this.object = object
        this.asObject = asObject
    }

    execute() {
        this.object.toSprite().angle = this.asObject.toSprite().angle
    }
}