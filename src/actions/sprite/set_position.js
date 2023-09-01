import {Action} from "../../system.js"

export default class SetPosition extends Action {
    constructor(sprite, position) {
        super()
        this.sprite = sprite
        this.position = position
    }

    execute() {
        this.sprite.toSprite().centerX = this.position.toSprite().centerX
        this.sprite.toSprite().centerY = this.position.toSprite().centerY
    }
}