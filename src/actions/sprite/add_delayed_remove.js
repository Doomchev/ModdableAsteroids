import {Action, apsk} from "../../system.js"

export default class AddDelayedDelete extends Action {
    constructor(sprite, layer, time) {
        super()
        this.sprite = sprite
        this.layer = layer
        this.time = time
    }

    execute() {
        let sprite = this.sprite.toSprite()
        sprite.actions.push(new DelayedDelete(sprite, this.layer, this.time))
    }
}

class DelayedDelete extends Action {
    constructor(sprite, layer, time) {
        super()
        this.sprite = sprite
        this.layer = layer
        this.time = time
    }

    execute() {
        super.execute()
        if(this.time <= 0.0) {
            this.layer.remove(this.sprite)
        } else {
            this.time -= apsk
        }
    }
}