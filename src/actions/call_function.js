import {Action, executeCode} from "../system.js"
import NumberFunction from "../functions/number_function.js"

let currentArgs = []

export default class CallFunction extends Action {
    constructor(func, args) {
        super()
        this.func = func
        this.args = args
    }

    execute() {
        currentArgs = this.args
        executeCode(this.func.code)
    }
}

export class CustomFunction {
    constructor(code) {
        this.code = code
    }
}

export class V extends NumberFunction {
    constructor(index) {
        super()
        this.index = index
    }

    toNumber() {
        return currentArgs[this.index]
    }
}