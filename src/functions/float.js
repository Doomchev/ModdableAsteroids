import {Value} from "../value.js"

export default class FloatFunction extends Value {
    getValue(fieldName) {
        return this.toFloat()
    }
}