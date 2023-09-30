export let project = {
    locale: "en",
    locales: {},
    key: {},
    scene: [],
    actions: [],
    registry: {},
    modules: [],
    allModules: [],

    _function: {},
    _data: "",

    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {},
}

export let val = project.registry, mod = project.modules, func = project._function

export function setRegistry(newRegistry) {
    project.registry = newRegistry
    val = newRegistry
}

export function setModules(newModules) {
    project.modules = newModules
}
