import Mod from "../mod.js"
import {val} from "../../src/project.js"
import {playSound} from "../../src/system.js"

export default class ExtraLifeBonus extends Mod {
    constructor(lifeBonus) {
        super()
        this.lifeBonus = lifeBonus
        this._nextLifeBonus = lifeBonus
    }

    getAssets() {
        return {
            texture: {},
            sound: {
                extraLife: "extra_life.mp3",
            },
        }
    }

    update() {
        if(val.score.value >= this._nextLifeBonus) {
            val.lives.increment()
            playSound(this.sound.extraLife)
            this._nextLifeBonus += this.lifeBonus
        }
    }

    reset() {
        this._nextLifeBonus = this.lifeBonus
    }
}