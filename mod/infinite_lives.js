import Mod from "./mod.js"
import {val} from "../src/project.js"

export default class InfiniteLives extends Mod {
    update() {
        let lives = val.lives
        let startingLives = val.startingLives
        if(lives.value < startingLives) lives.value = startingLives
    }
}