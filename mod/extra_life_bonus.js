import Mod from "../src/mod.js"
import {pobj, project} from "../src/project.js"

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
        if(pobj.score.value >= this.nextLifeBonus) {
            pobj.lives.value++
            new Audio(project.sound.extraLife).play()
            this.nextLifeBonus += this.lifeBonus
        }
    }

    reset() {
        this.nextLifeBonus = this.lifeBonus
    }
}