import Mod from "./mod.js"
import {val} from "../src/project.js"

export default class BonusForLevel extends Mod {
    constructor(bonus) {
        super()
        this.bonus = bonus
    }

    initLevel(level) {
        if(level > 1) val.score.increment(this.bonus)
    }
}