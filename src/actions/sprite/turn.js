import {Action, apsk, getValue} from "../../system.js"

export default class Turn extends Action {
    constructor(object, amount) {
        super()
        this.object = object
        this.amount = amount
    }

    execute() {
        this.object.toSprite().turn(this.amount.toFloat())
    }

    copy() {
        return new Turn(this.object.toSprite(), getValue(this.amount, "amount"))
    }
}