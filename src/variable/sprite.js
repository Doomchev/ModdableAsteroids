import {Value} from "../value.js"

export class SpriteFunction extends Value {
    toSprite() {
        return null
    }
}

export class SpriteVariable extends SpriteFunction {
    _sprite = null

    equateTo(value) {
        this.value = value.toSprite()
    }

    collisionWith(object, code) {
        this._sprite.collisionWith(object, code)
    }

    collisionWithSprite(sprite, code) {
        this._sprite.collisionWithSprite(sprite, code)
    }

    toBoolean() {
        return this._sprite
    }

    toSprite() {
        return this._sprite
    }
}

export let current = new SpriteVariable()