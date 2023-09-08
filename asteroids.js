import {project} from "./src/system.js"
import {importProject, importTextures} from "./src/import.js"
import {exportProject} from "./src/export.js"

project.loadTextures = () => {
    importTextures()
}

project.init = () => {
    importProject()
    exportProject()
}

project.data = ` 

textures = Object {
	ship: Texture("textures/ship.png")
	flame: Texture("textures/flame.png")
	bullet: Texture("textures/bullet.png")
	asteroid: Texture("textures/asteroid.png")
	explosion: Texture("textures/explosion.png")
}
loc = "ru"
keys = [
	Key(#left) {
		code: "ArrowLeft"
	}, 
	Key(#right) {
		code: "ArrowRight"
	}, 
	Key(#forward) {
		code: "ArrowUp"
	}, 
	Key(#fire) {
		code: "Space"
	}
]
scene = [
	Layer(#bullets) {
		items: []
	}, 
	Layer(#asteroids) {
		items: []
	}, 
	Sprite(#flame) {
		centerX: -0.9
		centerY: 0
		halfWidth: 0.5
		halfHeight: 0.5
		image: Image(#1) {
			texture: #flameTexture
			x: 0
			y: 0
			height: 64
			width: 64
		}
		angle: -1.5707963267948966
		speed: 0
	}, 
	Sprite(#ship) {
		centerX: 0
		centerY: 0
		halfWidth: 0.5
		halfHeight: 0.5
		image: Image(#2) {
			texture: #shipTexture
			x: 0
			y: 0
			height: 100
			width: 75
			xMul: 0.35
			heightMul: 1.9
			widthMul: 1.35
		}
		angle: 0
		speed: 0
	}, 
	Layer(#explosions) {
		items: []
	}, 
	Label(#3) {
		centerX: 0
		centerY: 0
		halfWidth: 4
		halfHeight: 7.518181818181818
		items: [
			IntVariable(#score) {
				value: -1000
				format: "Z8"
			}
		]
		horizontalAlign: 0
		verticalAlign: 0
	}, 
	Label(#4) {
		centerX: 0
		centerY: 0
		halfWidth: 4
		halfHeight: 7.518181818181818
		items: [
			Loc(level), 
			IntVariable(#level) {
				value: 0
			}
		]
		horizontalAlign: 1
		verticalAlign: 0
	}, 
	Label(#5) {
		centerX: 0
		centerY: 0
		halfWidth: 4
		halfHeight: 7.518181818181818
		items: [
			IntVariable(#lives) {
				value: 3
				format: "R ∆"
			}
		]
		horizontalAlign: 2
		verticalAlign: 0
	}, 
	Label(#6) {
		centerX: 0
		centerY: 0
		halfWidth: 4
		halfHeight: 7.518181818181818
		items: [
			""
		]
		horizontalAlign: 1
		verticalAlign: 1
	}
]
actions = [
	If {
		condition: IntIsEqual {
			value1: EnumVariable(#state) {
				value: 0
			}
			value2: 0
		}
		code: [
			If {
				condition: #left
				code: LinearChange {
					object: #ship
					parameterName: "angle"
					speed: -3.141592653589793
				}
			}, 
			If {
				condition: #right
				code: LinearChange {
					object: #ship
					parameterName: "angle"
					speed: 3.141592653589793
				}
			}, 
			If {
				condition: #forward
				code: LinearChange {
					object: #ship
					parameterName: "speed"
					speed: 40
					max: 7.5
				}
			}, 
			LinearChange {
				object: #ship
				parameterName: "speed"
				speed: -15
				min: 0
			}, 
			LoopArea {
				object: #ship
				area: Shape(#bounds) {
					centerX: 0
					centerY: 0
					halfWidth: 5.75
					halfHeight: 9.268181818181818
				}
			}, 
			Move {
				object: #ship
			}, 
			Animate {
				sprite: #flame
				array: ImageArray(#flameImages) {
					texture: #flameTexture
					columns: 3
					rows: 3
				}
				speed: 16
				frame: 0
			}, 
			SetField {
				object: #flame
				fieldName: "visible"
				value: #forward
			}, 
			Constraint {
				sprite: #flame
				parent: #ship
				dAngle: -1.5707963267948966
				distance: 0.9
				dAngle2: 3.141592653589793
			}, 
			Constraint {
				sprite: Sprite(#gun) {
					centerX: 1
					centerY: 0
					halfWidth: 0.5
					halfHeight: 0.5
					angle: 0
					speed: 0
				}
				parent: #ship
				dAngle: 0
				distance: 1
				dAngle2: 0
			}, 
			If {
				condition: Delayed {
					condition: #fire
					coolDown: 0.15
					time: 0
				}
				code: [
					Create {
						layer: #bullets
						image: ImageArray(#bulletImages) {
							texture: #bulletTexture
							columns: 1
							rows: 16
							xMul: 0.8958333333333334
							yMul: 0.4583333333333333
							heightMul: 3
							widthMul: 10.5
						}
						animationSpeed: 16
						position: #gun
						size: 0.15
						angle: #ship
						speed: 15
					}
				]
			}, 
			OnCollision {
				object1: #ship
				object2: #asteroids
				code: [
					Create {
						layer: #explosions
						image: ImageArray(#explosionImages) {
							texture: #explosionTexture
							columns: 4
							rows: 4
							heightMul: 2
							widthMul: 2
						}
						animationSpeed: 16
						position: #ship
						size: 2.5
						angle: RandomFloat {
							from: 6.283185307179586
						}
						speed: 0
					}, 
					AddAction {
						sprite: #current
						action: DelayedRemove {
							sprite: #current
							layer: #explosions
							time: 1
						}
					}, 
					SetField {
						object: #ship
						fieldName: "visible"
						value: false
					}, 
					SetField {
						object: #flame
						fieldName: "visible"
						value: false
					}, 
					If {
						condition: IntIsEqual {
							value1: #lives
							value2: 0
						}
						code: [
							SetField {
								object: #6
								fieldName: "items"
								value: [
									Loc(gameOver)
								]
							}, 
							Equate {
								variable: #state
								value: 2
							}
						]
						elseCode: [
							SetField {
								object: #6
								fieldName: "items"
								value: [
									Loc(pressSpace)
								]
							}, 
							Equate {
								variable: #state
								value: 1
							}
						]
					}
				]
			}
		]
		elseCode: [
			If {
				condition: Pressed {
					key: #fire
				}
				code: [
					SetField {
						object: #ship
						fieldName: "visible"
						value: true
					}, 
					SetField {
						object: #flame
						fieldName: "visible"
						value: true
					}, 
					SetField {
						object: #6
						fieldName: "items"
						value: []
					}, 
					SetField {
						object: #ship
						fieldName: "centerX"
						value: 0
					}, 
					SetField {
						object: #ship
						fieldName: "centerY"
						value: 0
					}, 
					SetField {
						object: #ship
						fieldName: "angle"
						value: 0
					}, 
					SetField {
						object: #ship
						fieldName: "speed"
						value: 0
					}, 
					If {
						condition: IntIsEqual {
							value1: #state
							value2: 1
						}
						code: [
							Decrement {
								variable: #lives
							}
						]
						elseCode: [
							Equate {
								variable: #lives
								value: IntVariable(#7) {
									value: 3
								}
							}, 
							Equate {
								variable: #score
								value: IntVariable(#8) {
									value: -1000
								}
							}, 
							Equate {
								variable: #level
								value: IntVariable(#9) {
									value: 0
								}
							}, 
							Clear {
								layer: #asteroids
							}
						]
					}, 
					Equate {
						variable: #state
						value: 0
					}
				]
			}
		]
	}, 
	SetBounds {
		layer: #bullets
		bounds: #bounds
	}, 
	ExecuteActions {
		object: #bullets
	}, 
	Move {
		object: #bullets
	}, 
	ExecuteActions {
		object: #asteroids
	}, 
	Move {
		object: #asteroids
	}, 
	LoopArea {
		object: #asteroids
		area: #bounds
	}, 
	ExecuteActions {
		object: #explosions
	}, 
	If {
		condition: IsEmpty {
			layer: #asteroids
		}
		code: [
			Increment {
				variable: #level
			}, 
			Repeat {
				times: #level
				code: [
					Create {
						layer: #asteroids
						image: ImageArray(#asteroidImages) {
							texture: #asteroidTexture
							columns: 8
							rows: 4
							heightMul: 1.5
							widthMul: 1.5
						}
						animationSpeed: Mul {
							value1: RandomFloat {
								from: 12
								to: 20
							}
							value2: RandomSign {}
						}
						position: Object(#10) {
							centerX: RandomFloat {
								from: -5.75
								to: 5.75
							}
							centerY: -9.268181818181818
						}
						size: 3
						angle: RandomFloat {
							from: 6.283185307179586
						}
						speed: RandomFloat {
							from: 2
							to: 3
						}
						imageAngle: 0
					}, 
					AddAction {
						sprite: #current
						action: RotateImage {
							object: #current
							speed: RandomFloat {
								from: -3.141592653589793
								to: 3.141592653589793
							}
						}
					}, 
					SetField {
						object: #current
						fieldName: "type"
						value: 0
					}
				]
			}, 
			Add {
				variable: #score
				value: 1000
			}
		]
	}, 
	OnCollision {
		object1: #bullets
		object2: #asteroids
		code: [
			If {
				condition: IntIsEqual {
					value1: GetField {
						object: #collisionSprite2
						fieldName: "type"
					}
					value2: 0
				}
				code: [
					CallFunction {
						func: CustomFunction(#11) {
							code: [
								Create {
									layer: #asteroids
									image: #asteroidImages
									animationSpeed: Mul {
										value1: RandomFloat {
											from: V {
												index: 0
											}
											to: V {
												index: 1
											}
										}
										value2: RandomSign {}
									}
									position: #collisionSprite2
									size: V {
										index: 2
									}
									angle: #collisionSprite1
									speed: RandomFloat {
										from: V {
											index: 3
										}
										to: V {
											index: 4
										}
									}
								}, 
								AddAction {
									sprite: #current
									action: RotateImage {
										object: #current
										speed: RandomFloat {
											from: -3.141592653589793
											to: 3.141592653589793
										}
									}
								}, 
								SetField {
									object: #current
									fieldName: "type"
									value: V {
										index: 5
									}
								}, 
								Turn {
									object: #current
									amount: Sum {
										value1: V {
											index: 6
										}
										value2: RandomFloat {
											from: -0.2617993877991494
											to: 0.2617993877991494
										}
									}
								}
							]
						}
						args: [
							16, 
							25, 
							2, 
							2.5, 
							4, 
							1, 
							0
						]
					}, 
					CallFunction {
						func: #11
						args: [
							20, 
							30, 
							1, 
							3, 
							5, 
							2, 
							1.0471975511965976
						]
					}, 
					CallFunction {
						func: #11
						args: [
							20, 
							30, 
							1, 
							3, 
							5, 
							2, 
							-1.0471975511965976
						]
					}, 
					Equate {
						variable: IntVariable(#size) {
							value: 0
						}
						value: 3
					}, 
					Add {
						variable: #score
						value: 100
					}
				]
			}, 
			If {
				condition: IntIsEqual {
					value1: GetField {
						object: #collisionSprite2
						fieldName: "type"
					}
					value2: 1
				}
				code: [
					CallFunction {
						func: #11
						args: [
							20, 
							30, 
							1, 
							3, 
							5, 
							2, 
							1.0471975511965976
						]
					}, 
					CallFunction {
						func: #11
						args: [
							20, 
							30, 
							1, 
							3, 
							5, 
							2, 
							-1.0471975511965976
						]
					}, 
					Equate {
						variable: #size
						value: 2
					}, 
					Add {
						variable: #score
						value: 200
					}
				]
			}, 
			If {
				condition: IntIsEqual {
					value1: GetField {
						object: #collisionSprite2
						fieldName: "type"
					}
					value2: 2
				}
				code: [
					Equate {
						variable: #size
						value: 1
					}, 
					Add {
						variable: #score
						value: 300
					}
				]
			}, 
			Create {
				layer: #explosions
				image: #explosionImages
				animationSpeed: 16
				position: #collisionSprite2
				size: #size
				angle: RandomFloat {
					from: 6.283185307179586
				}
				speed: 0
			}, 
			AddAction {
				sprite: #current
				action: DelayedRemove {
					sprite: #current
					layer: #explosions
					time: 1
				}
			}, 
			Remove {
				object: #collisionSprite1
				layer: #bullets
			}, 
			Remove {
				object: #collisionSprite2
				layer: #asteroids
			}
		]
	}
]
en = Object {
	level: "LEVEL "
	pressSpace: "PRESS SPACE"
	gameOver: "GAME OVER"
}
ru = Object {
	level: "УРОВЕНЬ "
	pressSpace: "НАЖМИТЕ ПРОБЕЛ"
	gameOver: "ИГРА ОКОНЧЕНА"
}
canvas = Canvas {
	centerX: 0
	centerY: 0
	halfWidth: 4.5
	halfHeight: 8.018181818181818
	angle: 0
	speed: 0
	viewport: Area(#15) {
		leftX: 0
		topY: 0
		width: 385
		height: 686
	}
}
background = "rgb(9, 44, 84)"
`