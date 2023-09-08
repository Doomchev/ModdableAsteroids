import SingleFunction from "./single.js"
import {Value} from "../value.js"

export default class FloatFunction extends SingleFunction {
    getValue(fieldName) {
        return this.toFloat()
    }

    getVal(value) {
        if(value instanceof Value) return value.toFloat()
        return value
    }
}