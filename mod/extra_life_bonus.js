import Mod from "../src/mod.js"
import {project, val} from "../src/project.js"
import {playSound} from "../src/system.js"

export default class ExtraLifeBonus extends Mod {
    constructor(lifeBonus) {
        super()
        this.lifeBonus = lifeBonus
        this.nextLifeBonus = lifeBonus
    }

    get name() {
        switch (project.locale) {
            case "ru":
                return "Дополнительная жизнь за очки"
            default:
                return "Extra life for score"
        }
    }

    update() {
        if(val.score.value >= this.nextLifeBonus) {
            val.lives.value++
            playSound("extraLife")
            this.nextLifeBonus += this.lifeBonus
        }
    }

    reset() {
        this.nextLifeBonus = this.lifeBonus
    }
}