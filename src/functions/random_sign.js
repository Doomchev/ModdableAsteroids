import {randomSign} from "../system.js"
import FloatFunction from "./float.js"

export default class RandomSign extends FloatFunction {
    toFloat() {
        return randomSign()
    }
}