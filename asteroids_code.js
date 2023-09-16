import Sprite from "./src/sprite.js"
import {loopedSound, loc, rad, rnd, randomSign} from "./src/system.js"
import Delayed from "./src/actions/delayed.js"
import LinearChange from "./src/actions/linear_change.js"
import {mod, playSound, obj, project, val, func} from "./src/project.js"
import RotateImage from "./src/actions/sprite/rotate_image.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"

export function initUpdate() {
    let asteroids = obj.asteroids
    let shipSprite = obj.shipSprite
    let flameSprite = obj.flameSprite
    let bullets = obj.bullets
    let bulletImages = obj.bulletImages
    let explosions = obj.explosions
    let explosionImages = obj.explosionImages
    let gun = obj.gun
    let lives = obj.lives
    let messageLabel = obj.messageLabel
    let level = obj.level
    let score = obj.score

    let ship = val.ship
    let state = val.state
    let key = project.key

    let currentState = state.alive

    function destroyAsteroid(asteroid, angle) {
        func.destroyAsteroid(asteroid, angle)
        func.createExplosion(asteroid, asteroid.type.size)
        asteroids.remove(asteroid)
    }

    loopedSound("music", 0, 1.81, true)
    let flameSound = loopedSound("flame", 1.1, 1.9, true)



    func.createAsteroids = function(num) {
        let bounds = obj.bounds
        for(let i = 0; i < num; i++) {
            let x, y
            if (rnd() < 0.5) {
                x = rnd(bounds.leftX, bounds.rightX)
                y = bounds.topY
            } else {
                x = bounds.leftX
                y = rnd(bounds.topY, bounds.bottomY)
            }
            func.createAsteroid(x, y, val.asteroidType.default, undefined, rnd(rad(360)))
        }
    }

    func.createAsteroid = function (centerX, centerY, type, piece, angle = 0) {
        let asteroid = Sprite.create(undefined, obj.asteroids, obj.asteroidImages, centerX, centerY
            , type.size, type.size, angle + rad(rnd(-15.0, 15.0)), rnd(type.minSpeed, type.maxSpeed)
            , rnd(type.minAnimSpeed, type.maxAnimSpeed) * randomSign(), rad(rnd(360)))
        asteroid.add(new RotateImage(asteroid, rad(rnd(-180, 180))))
        asteroid.type = type
        return asteroid
    }

    func.destroyAsteroid = function (asteroid, angle) {
        func.createExplosion(asteroid, asteroid.width)
    }

    func.createExplosion = function (sprite, size) {
        let explosion = Sprite.create(undefined, explosions, explosionImages, sprite.centerX, sprite.centerY
            , size, size, rad(rnd(360)), 0, 16)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        playSound("explosion")
    }



    project.update = () => {
       if(currentState === state.alive) {
            if(key.left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.dAngle))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.dAngle))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, 0, ship.limit)
                if(flameSound) flameSound.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            flameSprite.visible = key.forward.isDown

            if(val.gunDelay.active()) {
                Sprite.create(undefined, bullets, bulletImages, gun, undefined, 0.15, 0.15
                    , shipSprite.angle, 15.0, 16.0)
                playSound("shooting")
            }

            shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                playSound("death")
                func.createExplosion(shipSprite, 2)
                shipSprite.hide()
                flameSprite.hide()
                if (lives.value === 0) {
                    messageLabel.show(loc("gameOver"))
                    currentState = state.gameOver
                    playSound("gameOver")
                } else {
                    messageLabel.show(loc("pressEnter"))
                    currentState = state.dead
                }
                func.destroyAsteroid(asteroid, 0)
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
                level.value = 0
                mod.forEach(module => module.reset())
            }
            currentState = state.alive
        }

        if(asteroids.isEmpty()) {
            level.value++
            func.createAsteroids(level.value)
            mod.forEach(module => module.initLevel(level.value))
            new Audio(project.sound.newLevel).play()
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            destroyAsteroid(asteroid, bullet.angle)

            score.value += asteroid.type.score

            bullets.remove(bullet)
        })
    }
}