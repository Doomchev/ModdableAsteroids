import {fpsk, Renderable} from "./system.js"

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
}