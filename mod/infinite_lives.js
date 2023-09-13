import {Mod} from "../src/mod.js"
import {get} from "../src/system.js"
import {project} from "../src/project.js"

export default class InfiniteLives extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Бесконечные жизни"
            default:
                return "Infinite lives"
        }
    }

    init() {
        this._lives = get("lives")
        this._startingLives = project.registry.startingLives
    }

    update() {
        if(this._lives.value < this._startingLives) this._lives.value = this._startingLives
    }
}