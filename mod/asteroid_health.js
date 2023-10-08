import Mod from "./mod.js"
import {func, val} from "../src/project.js"
import {addTranslations} from "../src/tree.js"

export default class AsteroidsHealth extends Mod {
    init() {
        val.asteroidType.small.hp = 100
        val.asteroidType.medium.hp = 200
        val.asteroidType.default.hp = 300

        func.onAsteroidHit = function(asteroid, bullet) {
            asteroid.hp -= bullet.damage
            if(asteroid.hp <= 0) func.destroyAsteroid(asteroid, bullet.angle)
            func.createSingleExplosion(bullet, bullet.explosionSize, false)
            if(bullet.onHit) bullet.onHit()
        }

        addTranslations({
            AsteroidsHealth: "ЗдоровьеАстероидов",
        })
    }

    initAsteroid(asteroid) {
        asteroid.hp = asteroid.type.hp
    }

    update() {
        super.update()
    }
}