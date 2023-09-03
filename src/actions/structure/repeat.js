import {Action, executeCode} from "../../system.js"

export default class Repeat extends Action {
    constructor(times, code) {
        super()
        this.times = times
        this.code = code
    }

    execute() {
        let times = this.times.toInt()
        for(let i = 0; i < times; i++) {
            executeCode(this.code)
        }
    }
}