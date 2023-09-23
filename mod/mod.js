export default class Mod {
    get name() {return "Module"}
    actions = []
    init() {}
    reset() {}
    draw() {}
    update() {}

    initLevel(num) {}
    initAsteroid(asteroid) {}
    onAsteroidHit(asteroid) {}
    destroyAsteroid(asteroid) {}
}