import {Action, executeCode} from "../../system.js"

export default class Repeat extends Action {
    constructor(times, code) {
        super()
        this.times = times
        this.code = code
    }

    execute() {
        for(let i = 0; i < this.times; i++) {
            executeCode(this.code)
        }
    }
}