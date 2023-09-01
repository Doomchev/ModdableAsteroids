import {Action, executeCode} from "../../system.js"

export default class If extends Action {
    constructor(condition, code, elseCode) {
        super()
        this.condition = condition
        this.code = code
        this.elseCode = elseCode
    }

    execute() {
        if(this.condition.toBoolean()) {
            executeCode(this.code)
        } else if(this.elseCode) {
            executeCode(this.elseCode)
        }
    }
}