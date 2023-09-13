import {Mod} from "../src/mod.js"
import {get} from "../src/system.js"
import {project} from "../src/project.js"

export default class LifeBonus extends Mod {
    constructor(lifeBonus) {
        super()
        this.lifeBonus = lifeBonus
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
        let score = get("score")
        let lives = get("lives")
        this.nextLifeBonus = this.lifeBonus
        
        if(score.value === 0) {
            this.nextLifeBonus = this.lifeBonus
        } else if(score.value >= this.nextLifeBonus) {
            lives.value++
            this.nextLifeBonus += this.lifeBonus
        }
    }
}