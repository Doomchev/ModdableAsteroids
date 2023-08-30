import {Executable} from "./system.js"

export class IfBlock extends Executable {
    constructor(condition, code, elseCode) {
        super()
        this.condition = condition
        this.code = code
        this.elseCode = elseCode
    }

    execute() {
        if(this.condition.toBoolean()) {
            this.code.execute()
        } else if(this.elseCode) {
            this.elseCode.execute()
        }
    }
}