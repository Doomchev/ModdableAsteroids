import {Action} from "../../system.js"

export default class SetSize extends Action {
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
            sprite.width = this.size.toSprite().width
            sprite.height = this.size.toSprite().height
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