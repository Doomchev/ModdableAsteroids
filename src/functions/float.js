import SingleFunction from "./single.js"

export default class FloatFunction extends SingleFunction {
    getValue(fieldName) {
        return this.toFloat()
    }
}