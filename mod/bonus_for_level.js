import Mod from "./mod.js"
import {project, val} from "../src/project.js"
import {addTranslations} from "../src/tree.js"

export default class BonusForLevel extends Mod {
    constructor(bonus) {
        super()
        this.bonus = bonus
    }

    init() {
        addTranslations({
            BonusForLevel: "БонусЗаПрохождениеУровня"
        })
    }

    initLevel(level) {
        if(level > 1) val.score.increment(this.bonus)
    }
}