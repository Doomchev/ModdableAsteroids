import {Mod} from "../src/mod.js"
import {project} from "../src/project.js"

export class LifeBonus extends Mod {
    constructor(lifeBonus) {
        super()
        this.lifeBonus = lifeBonus
    }

    _init() {
        this.score = project._object.score
        this.lives = project._object.lives
        this.nextLifeBonus = this.lifeBonus
    }

    _update() {
        if(this.score.value === 0) {
            this.nextLifeBonus = this.lifeBonus
        } else if(this.score.value >= this.nextLifeBonus) {
            this.lives.value++
            this.nextLifeBonus += this.lifeBonus
        }
    }
}