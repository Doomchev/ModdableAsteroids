import Sprite from "./src/sprite.js"
import {collisionSprite1, collisionSprite2, loc, rad, randomSign, rnd} from "./src/system.js"
import RotateImage from "./src/actions/sprite/rotate_image.js"
import {current} from "./src/variable/sprite.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"
import Delayed from "./src/actions/delayed.js"
import LinearChange from "./src/actions/linear_change.js"
import {project} from "./src/project.js"

export function initUpdate() {
    let o = project._object

    let asteroidImages = o.asteroidImages
    let asteroids = o.asteroids
    let explosionImages = o.explosionImages
    let explosions = o.explosions
    let shipSprite = o.shipSprite
    let flameSprite = o.flameSprite
    let bullets = o.bullets
    let bulletImages = o.bulletImages
    let gun = o.gun
    let lives = o.lives
    let messageLabel = o.messageLabel
    let level = o.level
    let bounds = o.bounds
    let score = o.score

    let val = project.registry
    let ship = val.ship
    let state = val.state
    let asteroidType = val.asteroidType
    let key = project.key

    let currentState = state.alive
    let delayed = new Delayed(key.fire, 0.15)

    let nextLifeBonus = val.lifeBonus

    function createAsteroid(pos, type, piece, angle = 0) {
        let asteroid = new Sprite(asteroidImages, pos.centerX, pos.centerY, type.size, type.size
            , angle + rad(rnd(-15.0, 15.0)), rnd(type.minSpeed, type.maxSpeed)
            , rnd(type.minAnimSpeed, type.maxAnimSpeed) * randomSign())
        asteroid.add(new RotateImage(current, rad(rnd(-180.0, 180.0))))
        asteroid.type = type
        asteroids.add(asteroid)
        return asteroid
    }

    function createExplosion(sprite, size) {
        let explosion = new Sprite(explosionImages, sprite.centerX, sprite.centerY
            , size, size, rad(rnd(360.0)), 0, 16)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        explosions.add(explosion)
    }

    project._update = () => {
        if(currentState === state.alive) {
            if(key.left._isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.dAngle))
            }
            if(key.right._isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.dAngle))
            }
            if(key.forward._isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, undefined, ship.limit)
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
            }

            flameSprite.visible = key.forward._isDown

            if(delayed.active()) {
                bullets.add(new Sprite(bulletImages, gun.centerX, gun.centerY, 0.15, 0.15, shipSprite.angle
                    , 15.0, 16.0))
            }

            shipSprite.collisionWith(asteroids, () => {
                createExplosion(shipSprite, 2)
                shipSprite.hide()
                flameSprite.hide()
                if (lives.value === 0) {
                    messageLabel.items = [loc("gameOver")]
                    currentState = state.gameOver
                } else {
                    messageLabel.items = [loc("pressEnter")]
                    currentState = state.dead
                }
            })
        } else if(key.continue._isPressed) {
            shipSprite.show()
            flameSprite.show()
            messageLabel.items = []
            shipSprite.moveTo(0, 0)
            shipSprite.angle = 0
            shipSprite.speed = 0
            if(currentState === state.dead) {
                lives.value--
            } else {
                lives.value = val.startingLives
                score.value = 0
                nextLifeBonus =
                asteroids.clear()
            }
            currentState = state.alive
        }

        if(asteroids.isEmpty()) {
            level.value++
            for(let i = 0; i < level.value; i++) {
                let pos = {centerX: rnd(bounds.leftX, bounds.rightX), centerY: bounds.topY}
                createAsteroid(pos, asteroidType.big, undefined, rnd(rad(360)))
            }
            if(level > 1) score.value += val.levelBonus
        }

        bullets.collisionWith(asteroids, () => {
            let bullet = collisionSprite1.sprite
            let asteroid = collisionSprite2.sprite
            let type = asteroid.type

            type.pieces.forEach(piece =>  {
                createAsteroid(asteroid, piece.type, piece, bullet.angle + rad(piece.angle))
            })

            score.value += type.score
            if(score.value >= nextLifeBonus) {
                lives.value++
                nextLifeBonus += val.lifeBonus
            }

            createExplosion(asteroid, asteroid.width)
            bullets.remove(bullet)
            asteroids.remove(asteroid)
        })
    }
}