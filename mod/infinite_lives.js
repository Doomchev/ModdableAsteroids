import Mod from "../src/mod.js"
import {project, val} from "../src/project.js"

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
        let lives = val.lives
        let startingLives = val.startingLives
        if(lives.value < startingLives) lives.value = startingLives
    }
}