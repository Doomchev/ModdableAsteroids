import {Action, num} from "../../system.js"

export default class Add extends Action {
    constructor(variable, value) {
        super()
        this.variable = variable
        this.value = value
    }

    execute() {
        this.variable.add(num(this.value))
    }
}