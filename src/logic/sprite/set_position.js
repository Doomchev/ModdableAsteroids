import {Executable} from "../../system.js"

export default class SetPosition extends Executable {
    constructor(sprite, position) {
        super()
        this.sprite = sprite
        this.position = position
    }

    execute() {
        this.position.applyPositionTo(this.sprite.toSprite())
    }
}