import {Action} from "../system.js"
import {Value} from "../value.js"
import {SpriteFunction} from "../variable/sprite.js"
import {BooleanFunction} from "../functions/boolean.js"

export default class SetField extends Action {
    constructor(object, fieldName, value) {
        super()
        this.object = object
        this.fieldName = fieldName
        this.value = value
    }

    execute() {
        let object = this.object instanceof SpriteFunction ? this.object.toSprite() : this.object
        let value = this.value
        if(this.value instanceof BooleanFunction) {
            value = value.toBoolean()
        } else if(this.value instanceof SpriteFunction) {
            value = value.toSprite()
        } else if(this.value instanceof SpriteFunction) {
            value = value.toSprite()
        } else if(this.value instanceof Value) {
            value = value.toFloat()
        }
        object[this.fieldName] = value
    }
}