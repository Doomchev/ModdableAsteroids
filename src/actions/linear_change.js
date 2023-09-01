import {Action, fpsk} from "../system.js"

export default class LinearChange extends Action {
    constructor(object, parameterName, speed, min, max) {
        super()
        this.object = object
        this.parameterName = parameterName
        this.speed = speed
        this.min = min
        this.max = max
    }

    execute() {
        let currentSpeed = this.speed * fpsk
        let value = this.object[this.parameterName] + currentSpeed
        if(this.max !== undefined && value > this.max) {
            value = this.max
        } else if(this.min !== undefined && value < this.min) {
            value = this.min
        }
        this.object[this.parameterName] = value
    }
}