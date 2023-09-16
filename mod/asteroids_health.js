import Mod from "../src/mod.js"
import {func, val} from "../src/project.js"

export default class AsteroidsHealth extends Mod {
    init() {
        val.asteroidType.small.hp = 100
        val.asteroidType.medium.hp = 200
        val.asteroidType.big.hp = 300
        val.gunDelay.cooldown = 0.1

        func.asteroidHit = function(asteroid, bullet) {
            asteroid.hp -= 100
            if(asteroid.hp <= 0) func.destroyAsteroid(asteroid)
        }
    }

    initAsteroid(asteroid) {
        asteroid.hp = asteroid.type.hp
    }

    update() {
        super.update()
    }
}