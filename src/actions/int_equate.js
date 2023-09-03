import {Action} from "../system.js"

export default class Equate extends Action {
    constructor(variable, value) {
        super()
        this.variable = variable
        this.value = value
    }
    execute() {
        this.variable.equateTo(this.value)
    }
}