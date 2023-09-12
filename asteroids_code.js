import Sprite from "./src/sprite.js"
import {collisionSprite1, collisionSprite2, loc, rad, randomSign, rnd} from "./src/system.js"
import RotateImage from "./src/actions/sprite/rotate_image.js"
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

    function createAsteroid(centerX, centerY, type, piece, angle = 0) {
        let asteroid = Sprite.create(undefined, asteroids, asteroidImages, centerX, centerY, type.size, type.size
            , angle + rad(rnd(-15.0, 15.0)), rnd(type.minSpeed, type.maxSpeed)
            , rnd(type.minAnimSpeed, type.maxAnimSpeed) * randomSign(), rad(rnd(360)))
        asteroid.add(new RotateImage(asteroid, rad(rnd(-180, 180) / type.size)))
        asteroid.type = type
        return asteroid
    }

    function createExplosion(sprite, size) {
        let explosion = Sprite.create(undefined, explosions, explosionImages, sprite.centerX, sprite.centerY, size, size
            , rad(rnd(360)), 0, 16)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
    }

    function addScore(amount) {
        score.value += amount
        if(score.value >= nextLifeBonus) {
            lives.value++
            nextLifeBonus += val.lifeBonus
        }
    }

    project._update = () => {
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
                nextLifeBonus = val.lifeBonus
                asteroids.clear()
            }
            currentState = state.alive
        }

        if(asteroids.isEmpty()) {
            level.value++
            for(let i = 0; i < level.value; i++) {
                let x, y
                if (rnd() < 0.5) {
                    x = rnd(bounds.leftX, bounds.rightX)
                    y = bounds.topY
                } else {
                    x = bounds.leftX
                    y = rnd(bounds.topY, bounds.bottomY)
                }
                createAsteroid(x, y, asteroidType.big, undefined, rnd(rad(360)))
            }
            if(level > 1) score.value += val.levelBonus
        }

        bullets.collisionWith(asteroids, () => {
            let bullet = collisionSprite1.sprite
            let asteroid = collisionSprite2.sprite
            let type = asteroid.type

            type.pieces.forEach(piece =>  {
                createAsteroid(asteroid, undefined, piece.type, piece, bullet.angle + rad(piece.angle))
            })

            addScore(type.score)

            createExplosion(asteroid, asteroid.width)
            bullets.remove(bullet)
            asteroids.remove(asteroid)
        })
    }
}