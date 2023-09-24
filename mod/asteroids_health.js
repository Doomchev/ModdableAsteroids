import Mod from "./mod.js"
import {func, project, val} from "../src/project.js"
import {playSound} from "../src/system.js"

export default class AsteroidsHealth extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Здоровье астероидов"
            default:
                return "Asteroid health"
        }
    }

    init() {
        val.asteroidType.small.hp = 100
        val.asteroidType.medium.hp = 200
        val.asteroidType.big.hp = 300

        func.onAsteroidHit = function(asteroid, bullet) {
            asteroid.hp -= bullet.damage
            if(asteroid.hp <= 0) func.destroyAsteroid(asteroid, bullet.angle)
            func.createSingleExplosion(bullet, bullet.width * 2, false)
            if(bullet.onHit) bullet.onHit()
        }
    }

    initAsteroid(asteroid) {
        asteroid.hp = asteroid.type.hp
    }

    update() {
        super.update()
    }
}