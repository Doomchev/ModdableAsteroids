import Mod from "./mod.js"
import {project, val} from "../src/project.js"
import {addTranslations} from "../src/tree.js"

export default class InfiniteLives extends Mod {
    init() {
        addTranslations({
            InfiniteLives: "БесконечныеЖизни",
        })
    }

    update() {
        let lives = val.lives
        let startingLives = val.startingLives
        if(lives.value < startingLives) lives.value = startingLives
    }
}