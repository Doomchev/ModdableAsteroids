import {Action, getValue} from "../../system.js"
import Sprite from "../../sprite.js"
import {current, SpriteFunction} from "../../variable.js"
import Animate from "./animate.js"
import {Value} from "../../value.js"
import {NumberFunction} from "../../functions.js"

export default class Create extends Action {
    constructor(layer, image, animationSpeed, position, size = 1.0, angle = 0.0, speed = 0.0
                , imageAngle) {
        super()
        this.layer = layer
        this.image = image
        this.animationSpeed = animationSpeed
        this.position = position
        this.size = size
        this.angle = angle
        this.speed = speed
        this.imageAngle = imageAngle
    }

    execute() {
        let sprite = new Sprite(this.image)
        current.sprite = sprite
        if(this.animationSpeed === undefined) {
            sprite.image = this.image
        } else {
            sprite.image = this.image[0]
            sprite.actions.push(new Animate(sprite, this.image, getValue(this.animationSpeed)))
        }
        sprite.centerX = getValue(this.position, "centerX")
        sprite.centerY = getValue(this.position, "centerY")
        sprite.width = getValue(this.size, "width")
        sprite.height = sprite.width //getValue(this.size, "height")
        sprite.angle = getValue(this.angle, "angle")
        sprite.speed = getValue(this.speed, "speed")
        sprite.imageAngle = getValue(this.imageAngle, "imageAngle")
        this.layer?.items.push(sprite)
    }
}