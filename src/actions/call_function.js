import {Action, executeCode} from "../system.js"
import FloatFunction from "../functions/float.js"

let currentArgs = []

export default class CallFunction extends Action {
    constructor(func, ...args) {
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

export class V extends FloatFunction {
    constructor(index) {
        super()
        this.index = index
    }

    toFloat() {
        return currentArgs[this.index]
    }
}