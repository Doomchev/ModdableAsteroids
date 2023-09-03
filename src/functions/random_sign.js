import {randomSign} from "../system.js"
import FloatFunction from "./float.js"

export class RandomSign extends FloatFunction {
    toFloat() {
        return randomSign()
    }
}