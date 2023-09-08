import SingleFunction from "./single.js"
import {Value} from "../value.js"

export default class IntFunction extends SingleFunction {
    getValue(fieldName) {
        return this.toInt()
    }

    getVal(value) {
        if(value instanceof Value) return value.toInt()
        return value
    }
}