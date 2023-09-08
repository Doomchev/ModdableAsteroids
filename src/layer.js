import {removeFromArray} from "./system.js"
import {Renderable} from "./renderable.js"

export default class Layer extends Renderable {
    constructor(name, items = []) {
        super()
        if(name) this._name = name
        this.items = items
    }

    draw() {
        this.items.forEach(item => item.draw())
    }

    move() {
        this.items.forEach(item => item.move())
    }

    turn(angle) {
        this.items.forEach(item => item.turn(angle))
    }

    turnImage(angle) {
        this.items.forEach(item => item.turnImage(angle))
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