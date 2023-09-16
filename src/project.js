export let project = {
    texture: {},
    sound: {},
    locale: "ru",
    locales: {},
    _object: {},
    key: {},
    scene: [],
    actions: [],
    registry: {},
    modules: [],
    _data: "",
    loadTextures: () => {},
    init: () => {},
    update: () => {},
}

export let val = project.registry, pobj = project._object, modules = project.modules

export function setRegistry(newRegistry) {
    project.registry = newRegistry
    val = newRegistry
}

export function setModules(newModules) {
    project.modules = newModules
    modules = newModules
}

export function playSound(name) {
    new Audio(project.sound[name]).play()
}