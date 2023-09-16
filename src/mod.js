export default class Mod {
    get name() {return ""}
    actions = []
    init() {}
    reset() {}
    draw() {}
    update() {}

    initLevel(num) {}
    initAsteroid(asteroid) {}
    asteroidHit(asteroid) {}
    destroyAsteroid(asteroid) {}
}