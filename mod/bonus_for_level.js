import Mod from "../src/mod.js"
import {pobj, project} from "../src/project.js"

export default class BonusForLevel extends Mod {
    constructor(bonus) {
        super()
        this.bonus = bonus
    }
    get name() {
        switch (project.locale) {
            case "ru":
                return "Бонус за прохождение уровня"
            default:
                return "Bonus for finishing level"
        }
    }

    initLevel(level) {
        if(level > 1) pobj.score.value += this.bonus
    }
}