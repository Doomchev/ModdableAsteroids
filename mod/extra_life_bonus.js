import Mod from "./mod.js"
import {project, val} from "../src/project.js"
import {playSound} from "../src/system.js"
import {addTranslations} from "../src/tree.js"

export default class ExtraLifeBonus extends Mod {
    constructor(lifeBonus) {
        super()
        this.lifeBonus = lifeBonus
        this._nextLifeBonus = lifeBonus
    }

    init() {
        addTranslations({
            ExtraLifeBonus: "ДополнительнаяЖизньЗаОчки",
            lifeBonus: "очки",
        })
    }

    update() {
        if(val.score.value >= this._nextLifeBonus) {
            val.lives.increment()
            playSound(val.sound.extraLife)
            this._nextLifeBonus += this.lifeBonus
        }
    }

    reset() {
        this._nextLifeBonus = this.lifeBonus
    }
}