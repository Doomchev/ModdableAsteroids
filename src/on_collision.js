import {Action} from "./system.js"

export default class OnCollision extends Action {
    constructor(object1, object2, code) {
        super()
        this.object1 = object1
        this.object2 = object2
        this.code = code
    }

    execute() {
        this.object1.collisionWith(this.object2, this.code)
    }
}

