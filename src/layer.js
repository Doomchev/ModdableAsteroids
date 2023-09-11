import {removeFromArray} from "./system.js"
import {Renderable} from "./renderable.js"
import {project} from "./project.js"

export default class Layer extends Renderable {
    constructor(name, items = []) {
        super()
        if(name) project._object[name] = this
        this.items = items
    }

    draw() {
        this.items.forEach(item => item.draw())
    }

    // items management

    isEmpty() {
        return this.items.length === 0
    }

    clear() {
        this.items = []
    }

    add(sprite) {
        this.items.push(sprite)
    }

    remove(sprite) {
        removeFromArray(sprite.toSprite(), this.items)
    }

    // sprite manipulations

    move() {
        this.items.forEach(item => item.move())
    }

    loop(bounds) {
        this.items.forEach(item => item.loop(bounds))
    }

    turn(angle) {
        this.items.forEach(item => item.turn(angle))
    }

    turnImage(angle) {
        this.items.forEach(item => item.turnImage(angle))
    }

    collisionWith(object, code) {
        this.items.forEach(item => item.collisionWith(object, code))
    }

    collisionWithSprite(sprite, code) {
        this.items.forEach(item => item.collisionWithSprite(sprite, code))
    }
}