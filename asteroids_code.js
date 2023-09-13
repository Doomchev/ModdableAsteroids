import Sprite from "./src/sprite.js"
import {collisionSprite1, collisionSprite2, get, loc, rad} from "./src/system.js"
import Delayed from "./src/actions/delayed.js"
import LinearChange from "./src/actions/linear_change.js"
import {project} from "./src/project.js"

export function initUpdate() {
    let asteroids = get("asteroids")
    let shipSprite = get("shipSprite")
    let flameSprite = get("flameSprite")
    let bullets = get("bullets")
    let bulletImages = get("bulletImages")
    let gun = get("gun")
    let lives = get("lives")
    let messageLabel = get("messageLabel")
    let level = get("level")
    let score = get("score")

    let val = project.registry
    let ship = val.ship
    let state = val.state
    let key = project.key

    let currentState = state.alive
    let delayed = new Delayed(key.fire, 0.15)

    project.update = () => {
        let createAsteroid = project.registry.createAsteroid
        let createExplosion = project.registry.createExplosion

        if(currentState === state.alive) {
            if(key.left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.dAngle))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.dAngle))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, 0, ship.limit)
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
            }

            flameSprite.visible = key.forward.isDown

            if(delayed.active()) {
                Sprite.create(undefined, bullets, bulletImages, gun, undefined, 0.15, 0.15
                    , shipSprite.angle, 15.0, 16.0)
            }

            shipSprite.collisionWith(asteroids, () => {
                createExplosion(shipSprite, 2)
                shipSprite.hide()
                flameSprite.hide()
                if (lives.value === 0) {
                    messageLabel.show(loc("gameOver"))
                    currentState = state.gameOver
                } else {
                    messageLabel.show(loc("pressEnter"))
                    currentState = state.dead
                }
            })
        } else if(key.continue.wasPressed) {
            shipSprite.show()
            flameSprite.show()
            messageLabel.show()
            shipSprite.moveTo(0, 0)
            shipSprite.angle = 0
            shipSprite.speed = 0
            if(currentState === state.dead) {
                lives.value--
            } else {
                lives.value = val.startingLives
                score.value = 0
                asteroids.clear()
            }
            currentState = state.alive
        }

        if(asteroids.isEmpty()) {
            level.value++
            project.modules.forEach(module => module.initLevel(level.value))
        }

        bullets.collisionWith(asteroids, () => {
            let bullet = collisionSprite1.sprite
            let asteroid = collisionSprite2.sprite

            project.modules.forEach(module => module.destroyAsteroid(asteroid, bullet))

            score.value += asteroid.type.score

            bullets.remove(bullet)
            asteroids.remove(asteroid)
        })
    }
}