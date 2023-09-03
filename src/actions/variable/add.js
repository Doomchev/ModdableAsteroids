import {Action} from "../../system.js"
import {Value} from "../../value.js"

export default class Add extends Action {
    constructor(variable, value) {
        super()
        this.variable = variable
        this.value = value
    }

    execute() {
        this.variable.add(this.value instanceof Value ? this.value.toInt() : this.value)
    }
}