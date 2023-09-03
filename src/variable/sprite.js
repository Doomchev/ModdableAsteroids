import {Value} from "../value.js"

export class SpriteFunction extends Value {
    toSprite() {
        return null
    }
}

export class SpriteVariable extends SpriteFunction {
    sprite = null

    equateTo(value) {
        this.value = value.toSprite()
    }

    collisionWith(object, code) {
        this.sprite.collisionWith(object, code)
    }

    collisionWithSprite(sprite, code) {
        this.sprite.collisionWithSprite(sprite, code)
    }

    toBoolean() {
        return this.sprite
    }

    toSprite() {
        return this.sprite
    }
}

export let current = new SpriteVariable()