import {Value} from "../value.js"
import {project} from "../project.js"
import {setName} from "../system.js"

export default class SpriteVariable extends Value {
    constructor(name) {
        super()
        setName(this, name)
        this._id = name
        this.sprite = null
    }

    collisionWith(object, code) {
        this.sprite.collisionWith(object, code)
    }

    collisionWithSprite(sprite, code) {
        this.sprite.collisionWithSprite(sprite, code)
    }

    toSprite() {
        return this.sprite
    }
}

export let current = new SpriteVariable("current")