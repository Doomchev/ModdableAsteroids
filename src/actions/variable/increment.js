import {Action} from "../../system.js"

export default class Increment extends Action {
    constructor(variable) {
        super()
        this.variable = variable
    }

    execute() {
        this.variable.add(1)
    }
}