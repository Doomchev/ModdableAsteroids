import {Action} from "../../system.js"
import Sprite from "../../sprite.js"
import {current} from "../../variable.js"
import Animate from "./animate.js"

export default class Create extends Action {
    constructor(layer, image, animationSpeed, position, size = 1.0, angle = 0.0, speed = 0.0) {
        super()
        this.layer = layer
        this.image = image
        this.animationSpeed = animationSpeed
        this.position = position
        this.size = size
        this.angle = angle
        this.speed = speed
    }

    execute() {
        let sprite = new Sprite(this.image)
        current.sprite = sprite
        if(this.animationSpeed === undefined) {
            sprite.image = this.image
        } else {
            sprite.image = this.image[0]
            sprite.actions.push(new Animate(sprite, this.image, this.animationSpeed))
        }
        sprite.centerX = this.position?.toSprite().centerX ?? 0.0
        sprite.centerY = this.position?.toSprite().centerY ?? 0.0
        if(typeof this.size == "number") {
            sprite.width = sprite.height = this.size
        } else {
            sprite.width = this.size?.toSprite().width
            sprite.height = this.size?.toSprite().height
        }
        sprite.angle = this.angle?.angle ?? this.angle
        sprite.speed = this.speed?.speed ?? this.speed
        this.layer?.items.push(sprite)
    }
}