import {Action, apsk} from "../../system.js"

export default class DelayedRemove extends Action {
    constructor(sprite, layer, time) {
        super()
        this.sprite = sprite
        this.layer = layer
        this.time = time
    }

    execute() {
        super.execute()
        if(this.time <= 0.0) {
            this.layer.remove(this.sprite.toSprite())
        } else {
            this.time -= apsk
        }
    }

    copy() {
        return new DelayedRemove(this.sprite, this.layer, this.time)
    }
}