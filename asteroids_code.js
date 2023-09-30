import Sprite from "./src/sprite.js"
import {loc, loopedSound, num, paused, playSound, rad, rnd, togglePause} from "./src/system.js"
import LinearChange from "./src/actions/linear_change.js"
import {func, mod, project, val} from "./src/project.js"
import RotateImage from "./src/actions/sprite/rotate_image.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"
import {makeInvulnerable} from "./mod/invulnerability.js"

export function initUpdate() {
    let asteroids = val.asteroids
    let shipSprite = val.shipSprite
    let flameSprite = val.flameSprite
    let bullets = val.bullets
    let explosions = val.explosions
    let shipLayer = val.shipLayer

    let lives = val.lives
    let messageLabel = val.messageLabel
    let level = val.level
    let score = val.score

    let state = val.state
    let key = project.key
    let template = val.template
    let ship = val.ship

    let currentState = state.alive

    loopedSound(project.sound.music, 0, 1.81, true)
    let flameSound = loopedSound(project.sound.flame, 1.1, 1.9)

    // functions

    func.createAsteroids = function(num) {
        for(let i = 0; i < num; i++) {
            let asteroid = func.createAsteroid(0, 0, val.asteroidType.default, rnd(rad(360)))
            asteroid.moveToPerimeter(val.bounds)
        }
    }

    func.createAsteroid = function (centerX, centerY, type, angle = 0) {
        let asteroid = Sprite.createFromTemplate(type)
        if(centerY === undefined) {
            asteroid.setPositionAs(centerX.toSprite())
        } else {
            asteroid.moveTo(centerX, centerY)
        }
        asteroid.turn(angle)
        asteroid.type = type
        asteroid.imageAngle = 0
        asteroid.add(new RotateImage(asteroid, num(type.rotationSpeed)))
        mod.forEach(module => module.initAsteroid(asteroid))
        return asteroid
    }

    func.removeAsteroid = function (asteroid) {
        score.increment(asteroid.type.score)
        asteroids.remove(asteroid)
    }

    func.onAsteroidHit = function(asteroid, bullet) {
        func.destroyAsteroid(asteroid, bullet.angle)
        func.createSingleExplosion(bullet, bullet.explosionSize, false)
    }

    func.destroyAsteroid = function (asteroid, angle) {
        func.createExplosion(asteroid, asteroid.width)
        mod.forEach(module => module.destroyAsteroid(asteroid, angle))
        if(asteroid.onHit) asteroid.onHit()
        func.removeAsteroid(asteroid)
    }

    func.explosionDamage = function(sprite) {
        sprite.size = sprite.explosionSize
        let inExplosion = []
        sprite.collisionWith(val.asteroids, (mis, asteroid) => {
            inExplosion.push(asteroid)
        })
        inExplosion.forEach((asteroid) => {
            func.destroyAsteroid(asteroid, sprite.angleTo(asteroid))
        })
    }

    func.createExplosion = function (sprite, size, playSnd = true) {
        let explosion = Sprite.createFromTemplate(template.explosion)
        explosion.width = explosion.height = size
        explosion.moveTo(sprite.centerX, sprite.centerY)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        if(playSnd) playSound(project.sound.explosion)
    }
    func.createSingleExplosion = func.createExplosion

    func.destroyShip = function() {
        func.createExplosion(shipSprite, 2)
        val.shipSprite.setFromTemplate(template.ship)
        val.shipLayer.hide()
        if(lives.value === 0) {
            messageLabel.show(loc("gameOver"))
            currentState = state.gameOver
            playSound(project.sound.gameOver)
        } else {
            messageLabel.show(loc("pressEnter"))
            currentState = state.dead
            playSound(project.sound.death)
        }
    }

    // main

    project.update = () => {
        if(key.pause.wasPressed) {
            togglePause()
            if(paused) {
                messageLabel.show(loc("paused"))
            } else {
                messageLabel.show()
            }
        }
        if(paused) return

        if(currentState === state.alive) {
            if(key.left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.angularSpeed))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.angularSpeed))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, 0, ship.accelerationLimit)
                if(flameSound) flameSound.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            flameSprite.visible = key.forward.isDown

            if(!val.invulnerable) {
                shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                    func.destroyShip()
                    func.destroyAsteroid(asteroid, 0)
                })
            }
        } else if(key.continue.wasPressed) {
            shipLayer.show()
            messageLabel.show()
            if(currentState === state.dead) {
                lives.decrement()
                makeInvulnerable(2, 0.05)
            } else {
                lives.value = val.startingLives
                score.value = 0
                asteroids.clear()
                level.value = 0
                mod.forEach(module => module.reset())
            }
            currentState = state.alive
        } else {
            if(!flameSound.paused) flameSound.pause()
        }

        if(asteroids.isEmpty()) {
            level.increment()
            func.createAsteroids(level.value)
            mod.forEach(module => module.initLevel(level.value))
            playSound(project.sound.newLevel)
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            func.onAsteroidHit(asteroid, bullet)
            bullets.remove(bullet)
        })
    }
}