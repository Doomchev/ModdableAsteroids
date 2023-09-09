import {randomSign} from "../system.js"
import NumberFunction from "./number_function.js"

export default class RandomSign extends NumberFunction {
    toNumber() {
        return randomSign()
    }
}