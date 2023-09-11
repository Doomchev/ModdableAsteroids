import Shape from "./shape.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {apsk, executeCollisionCode} from "./system.js"
import Animate from "./actions/sprite/animate.js"

export default class Sprite extends Shape {
    constructor(name, image, centerX = 0.0, centerY = 0.0, width = 1.0, height = 1.0
                , angle = 0.0, speed = 0.0, animationSpeed, imageAngle
                , active = true, visible = true) {
        super(name, centerX, centerY, width, height)
        this.image = image
        this.imageAngle = imageAngle
        this.angle = angle
        this.speed = speed
        this.visible = true
        this.active = active
        this.visible = visible
        this.actions = []
        if(animationSpeed !== undefined) {
            this.actions.push(new Animate(this, this.image, animationSpeed))
            this.image = this.image._images[0]
        }
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

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
    }

    loop(bounds) {
        if(this.centerX < bounds.leftX) this.centerX += bounds.width
        if(this.centerX >= bounds.rightX) this.centerX -= bounds.width
        if(this.centerY < bounds.topY) this.centerY += bounds.height
        if(this.centerY >= bounds.bottomY) this.centerY -= bounds.height
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