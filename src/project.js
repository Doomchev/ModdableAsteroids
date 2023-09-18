export let project = {
    texture: {},
    sound: {},
    locale: "ru",
    locales: {},
    key: {},
    scene: [],
    actions: [],
    registry: {},
    modules: [],
    allModules: [],

    _object: {},
    _function: {},
    _data: "",

    loadTextures: () => {},
    init: () => {},
    update: () => {},
}

export let val = project.registry, obj = project._object, mod = project.modules, func = project._function

export function setRegistry(newRegistry) {
    project.registry = newRegistry
    val = newRegistry
}

export function setModules(newModules) {
    project.modules = newModules
}
