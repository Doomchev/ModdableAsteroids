import Shape from "./shape.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {fpsk} from "./system.js"

export default class Sprite extends Shape {
    constructor(image, centerX = 0.0, centerY = 0.0, width = 1.0, height = 1.0
                , angleInDegrees = 0.0, speed = 0.0) {
        super(centerX, centerY, width, height)
        this.image = image
        this.angle = angleInDegrees * Math.PI / 180.0
        this.speed = speed
        this.visible = true
    }

    draw() {
        if(!this.image || !this.visible) return
        this.image.drawRotated(xToScreen(this.centerX), yToScreen(this.centerY)
            , distToScreen(this.width), distToScreen(this.height), this.angle, false)
    }

    move() {
        this.centerX += Math.cos(this.angle) * this.speed * fpsk
        this.centerY += Math.sin(this.angle) * this.speed * fpsk
    }

    applyPositionTo(sprite) {
        sprite.centerX = this.centerX
        sprite.centerY = this.centerY
    }

    applySizeTo(sprite) {
        sprite.centerX = this.width
        sprite.centerY = this.height
    }

    toSprite() {
        return this
    }
}