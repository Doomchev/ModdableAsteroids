import SingleFunction from "./single.js"

export default class NumberFunction extends SingleFunction {
    getValue(fieldName) {
        return this.toNumber()
    }
}