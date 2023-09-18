import Mod from "../src/mod.js"
import {func, obj, project} from "../src/project.js"
import Sprite from "../src/sprite.js"
import {playSound, rad, rnd, rndi} from "../src/system.js"
import DelayedRemove from "../src/actions/sprite/delayed_remove.js"

export default class MultiExplosion extends Mod {
    constructor() {
        super()
    }

    get name() {
        switch (project.locale) {
            case "ru":
                return "Многоспрайтовый взрыв"
            default:
                return "Multisprite explosion"
        }
    }

    init() {
        let explosions = obj.explosions
        let explosionImages = obj.explosionImages

        func.createExplosion = function (sprite, size, playSnd = true) {
            let times = rndi(3) + size
            createParticle(true)
            if(playSnd) playSound("explosion")

            function createParticle(first) {
                let angle = rad(rnd(360))
                let length = first ? 0 : rnd(1)
                let particleSize = first ? size : (1 - length / 2) * size

                let explosion = Sprite.create(undefined, explosions, explosionImages
                    , sprite.centerX + length * Math.cos(angle), sprite.centerY + length * Math.sin(angle)
                    , particleSize, particleSize, rad(rnd(360)), 0, 16)
                explosion.add(new DelayedRemove(explosion, explosions, 1))
                times--
                if(times > 0) setTimeout(createParticle, 100)
            }
        }
    }
}