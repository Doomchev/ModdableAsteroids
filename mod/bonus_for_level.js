import Mod from "./mod.js"
import {project, val} from "../src/project.js"

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
        if(level > 1) val.score.increment(this.bonus)
    }
}