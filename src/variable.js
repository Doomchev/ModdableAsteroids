import {Value} from "./value.js"

export class SpriteVariable extends Value {
    sprite = null

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

export let current = new SpriteVariable()