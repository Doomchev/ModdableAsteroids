export let project = {
    texture: {},
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

export let val = project.registry, pobj = project._object

export function setRegistry(newRegistry) {
    project.registry = newRegistry
    val = newRegistry
}