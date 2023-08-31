import {current, Executable} from "../../system.js"
import Sprite from "../../sprite.js"

export default class Create extends Executable {
    constructor(layer, image, position, size = 1.0, angle = 0.0, speed = 0.0) {
        super()
        this.layer = layer
        this.image = image
        this.position = position
        this.size = size
        this.angle = angle
        this.speed = speed
    }

    execute() {
        let sprite = new Sprite(this.image)
        current.sprite = sprite
        sprite.centerX = this.position?.centerX ?? 0.0
        sprite.centerY = this.position?.centerY ?? 0.0
        sprite.width = this.size?.width ?? this.size
        sprite.height = this.size?.height ?? this.size
        sprite.angle = this.angle?.angle ?? this.angle
        sprite.speed = this.speed?.speed ?? this.speed
        this.layer?.items.push(sprite)
    }
}