import {Action} from "../system.js"
import {SpriteFunction} from "../variable/sprite.js"

export default class GetField extends Action {
    constructor(object, fieldName) {
        super()
        this.object = object
        this.fieldName = fieldName
    }

    getObject() {
        return this.object instanceof SpriteFunction ? this.object.toSprite() : this.object
    }

    toBoolean() {
        return this.getObject()[this.fieldName]
    }

    toInt() {
        return this.getObject()[this.fieldName]
    }

    toFloat() {
        return this.getObject()[this.fieldName]
    }

    toString() {
        return this.getObject()[this.fieldName]
    }

    toSprite() {
        return this.getObject()[this.fieldName]
    }
}