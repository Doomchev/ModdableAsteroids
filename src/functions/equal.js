import {Value} from "../value.js"

class BooleanFunction extends Value {
    toBoolean() {}
}

export default class IntIsEqual extends BooleanFunction {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toBoolean() {
        return this.value1.toInt() === this.value2.toInt()
    }
}

