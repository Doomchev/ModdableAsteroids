import {Action} from "../../system.js"
import Layer from "../../layer.js"

export default class LoopArea extends Action {
    constructor(object, area) {
        super()
        this.object = object
        this.area = area
    }

    execute() {
        if(this.object instanceof Layer) {
            this.object.items.forEach(sprite => loop(sprite, this.area))
        } else {
            loop(this.object, this.area)
        }
    }
}

function loop(sprite, bounds) {
    if(sprite.centerX < bounds.leftX) sprite.centerX += bounds.width
    if(sprite.centerX >= bounds.rightX) sprite.centerX -= bounds.width
    if(sprite.centerY < bounds.topY) sprite.centerY += bounds.height
    if(sprite.centerY >= bounds.bottomY) sprite.centerY -= bounds.height
}