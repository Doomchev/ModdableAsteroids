import {Executable, Value} from "../system.js"

export default class SetField extends Executable {
    constructor(object, fieldName, value) {
        super()
        this.object = object
        this.fieldName = fieldName
        this.value = value
    }

    execute() {
        this.object.toSprite()[this.fieldName] = this.value.toBoolean !== undefined ? this.value.toBoolean() : this.value
    }
}