import Shape from "./shape.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {apsk, executeCollisionCode} from "./system.js"

export default class Sprite extends Shape {
    constructor(name, image, centerX = 0.0, centerY = 0.0, width = 1.0, height = 1.0
                , angle = 0.0, speed = 0.0, imageAngle, active = true, visible = true) {
        super(name, centerX, centerY, width, height)
        this.image = image
        this.imageAngle = imageAngle
        this.angle = angle
        this.speed = speed
        this.visible = true
        this.active = active
        this.visible = visible
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

    turn(value) {
        this.angle += value
    }

    turnImage(value) {
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