import {Executable} from "./system.js"

export class If extends Executable {
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

function executeCode(code) {
    if(code instanceof Array) {
        code.forEach((item) => item.execute())
    } else {
        code.execute()
    }
}