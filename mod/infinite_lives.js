import Mod from "../src/mod.js"
import {pobj, project, val} from "../src/project.js"

export default class InfiniteLives extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Бесконечные жизни"
            default:
                return "Infinite lives"
        }
    }

    update() {
        let lives = pobj.lives
        let startingLives = val.startingLives
        if(lives.value < startingLives) lives.value = startingLives
    }
}