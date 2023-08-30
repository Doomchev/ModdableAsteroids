import {Executable} from "../../system.js"
import Layer from "../../layer.js";

export default class LoopArea extends Executable {
    constructor(object, area) {
        super()
        this.object = object
        this.area = area
    }

    loop(sprite) {
        let bounds = this.area
        if(sprite.centerX < bounds.leftX) sprite.centerX += bounds.width
        if(sprite.centerX >= bounds.rightX) sprite.centerX -= bounds.width
        if(sprite.centerY < bounds.topY) sprite.centerY += bounds.height
        if(sprite.centerY >= bounds.bottomY) sprite.centerY -= bounds.height
    }

    execute() {
        if(this.object instanceof Layer) {
            this.object.items.forEach(sprite => this.loop(sprite))
        } else {
            this.loop(this.object)
        }
    }
}