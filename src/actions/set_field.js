import {Action} from "../system.js"
import {Value} from "../value.js"
import {SpriteFunction} from "../variable/sprite.js"

export default class SetField extends Action {
    constructor(object, fieldName, value) {
        super()
        this.object = object
        this.fieldName = fieldName
        this.value = value
    }

    execute() {
        let object = this.object instanceof SpriteFunction ? this.object.toSprite() : this.object
        object[this.fieldName] = this.value instanceof Value ? this.value.toBoolean() : this.value
    }
}