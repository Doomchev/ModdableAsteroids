import {Value} from "../value.js"

export default class EnumVariable extends Value {
    constructor(name, value) {
        super()
        if(name) this._name = name
        this.value = value
    }
}