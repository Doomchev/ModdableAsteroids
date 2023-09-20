import {randomSign} from "../system.js"
import {Function} from "../function.js"

export default class RandomSign extends Function {
    static instance = new RandomSign()

    toNumber() {
        return randomSign()
    }
}