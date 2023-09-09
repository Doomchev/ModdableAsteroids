import {Action, num} from "../../system.js"

export default class Turn extends Action {
    constructor(object, amount) {
        super()
        this.object = object
        this.amount = amount
    }

    execute() {
        this.object.toSprite().turn(num(this.amount))
    }

    copy() {
        return new Turn(this.object, this.amount)
    }
}