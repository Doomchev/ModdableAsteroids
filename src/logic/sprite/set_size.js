import {Executable} from "../../system.js"

export default class SetSize extends Executable {
    constructor(object, size, width, height) {
        super()
        this.object = object
        this.size = size
        this.width = width
        this.height = height
    }

    execute() {
        let sprite = this.object.toSprite()
        if(typeof this.size === "number") {
            sprite.width = this.size
            sprite.height = this.size
        } else if(this.size !== undefined) {
            this.size.applySizeTo(sprite)
            return
        } else {
            if(this.width !== undefined) {
                sprite.width = this.width
            }
            if (this.height !== undefined) {
                sprite.height = this.height
            }
        }
    }
}