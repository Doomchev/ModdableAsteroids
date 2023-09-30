import Mod from "./mod.js"
import {func, project, val} from "../src/project.js"
import Sprite from "../src/sprite.js"
import {playSound, rad, rnd, rndi} from "../src/system.js"
import DelayedRemove from "../src/actions/sprite/delayed_remove.js"
import {addTranslations} from "../src/tree.js"

export default class MultiExplosion extends Mod {
    constructor() {
        super()
    }

    init() {
        let explosions = val.explosions
        let explosionImages = val.explosionImages

        func.createExplosion = function (sprite, size, playSnd = true) {
            let times = rndi(3) + size
            createParticle(true)
            if(playSnd) playSound(val.sound.explosion)

            function createParticle(first) {
                let angle = rad(rnd(360))
                let length = first ? 0 : rnd(1)
                let particleSize = first ? size : (1 - length / 2) * size

                let explosion = Sprite.create(explosions, explosionImages
                    , sprite.centerX + length * Math.cos(angle), sprite.centerY + length * Math.sin(angle)
                    , particleSize, particleSize, rad(rnd(360)), 0, 16)
                explosion.add(new DelayedRemove(explosion, explosions, 1))
                times--
                if(times > 0) setTimeout(createParticle, 100)
            }
        }

        addTranslations({
            MultiExplosion: "МультиВзрыв"
        })
    }
}