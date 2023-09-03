import Shape from "./shape.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {executeCollisionCode, apsk, toRadians} from "./system.js"

export default class Sprite extends Shape {
    constructor(image, centerX = 0.0, centerY = 0.0, width = 1.0, height = 1.0
                , angleInDegrees = 0.0, speed = 0.0, imageAngle) {
        super(centerX, centerY, width, height)
        this.image = image
        this.imageAngle = imageAngle
        this.angle = toRadians(angleInDegrees)
        this.speed = speed
        this.visible = true
        this.actions = []
    }

    draw() {
        if(!this.image || !this.visible) return
        this.image.drawRotated(xToScreen(this.centerX), yToScreen(this.centerY)
            , distToScreen(this.width), distToScreen(this.height), this.imageAngle ?? this.angle, false)
    }

    move() {
        this.centerX += Math.cos(this.angle) * this.speed * apsk
        this.centerY += Math.sin(this.angle) * this.speed * apsk
    }

    rotate(value) {
        this.imageAngle += value
    }

    collisionWith(object, code) {
        object.collisionWithSprite(this, code)
    }

    collisionWithSprite(sprite, code) {
        if(sprite.collidesWithSprite(this)) {
            executeCollisionCode(sprite, this, code)
        }
    }

    collidesWithSprite(sprite) {
        let dx = this.centerX - sprite.centerX
        let dy = this.centerY - sprite.centerY
        let radius = this.halfWidth + sprite.halfWidth
        return dx * dx + dy * dy < radius * radius
    }

    toSprite() {
        return this
    }
}