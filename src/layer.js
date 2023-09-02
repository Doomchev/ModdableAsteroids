import {removeFromArray, Renderable} from "./system.js"

export default class Layer extends Renderable {
    constructor(items = []) {
        super()
        this.items = items
    }

    draw() {
        this.items.forEach(item => item.draw())
    }

    move() {
        this.items.forEach(item => item.move())
    }

    rotate(angle) {
        this.items.forEach(item => item.rotate(angle))
    }

    remove(sprite) {
        removeFromArray(sprite.toSprite(), this.items)
    }

    collisionWith(object, code) {
        this.items.forEach(item => item.collisionWith(object, code))
    }

    collisionWithSprite(sprite, code) {
        this.items.forEach(item => item.collisionWithSprite(sprite, code))
    }
}