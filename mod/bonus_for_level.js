import {Mod} from "../src/mod.js"
import {get} from "../src/system.js"
import {project} from "../src/project.js"

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

    init() {
        this._score = get("score")
    }

    initLevel(level) {
        if(level > 1) this._score.value += this.bonus
    }
}