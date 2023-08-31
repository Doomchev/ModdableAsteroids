import {Executable, executeCode} from "../../system.js"

export default class If extends Executable {
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