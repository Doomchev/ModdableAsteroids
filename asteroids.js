// noinspection UnreachableCodeJS

import Image from "./src/image.js"
import Sprite from "./src/sprite.js"
import Key from "./src/key.js"
import {
    addTextures,
    align,
    collisionSprite1,
    collisionSprite2,
    project,
    root,
    textures,
    toRadians
} from "./src/system.js"
import LinearChange from "./src/actions/linear_change.js"
import Move from "./src/actions/sprite/move.js"
import If from "./src/actions/structure/if.js"
import ImageArray from "./src/image_array.js"
import Constraint from "./src/constraint.js"
import Animate from "./src/actions/sprite/animate.js"
import SetField from "./src/actions/set_field.js"
import Layer from "./src/layer.js"
import Create from "./src/actions/sprite/create.js"
import Delayed from "./src/actions/delayed.js"
import {currentCanvas} from "./src/canvas.js"
import SetBounds from "./src/actions/sprite/set_bounds.js"
import LoopArea from "./src/actions/sprite/loop_area.js"
import Shape from "./src/shape.js"
import ExecuteActions from "./src/actions/sprite/execute_actions.js"
import Rotate from "./src/actions/sprite/rotate.js"
import OnCollision from "./src/on_collision.js"
import Remove from "./src/actions/sprite/remove.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"
import IsEmpty from "./src/functions/is_empty.js"
import AddAction from "./src/actions/sprite/add_action.js"
import Repeat from "./src/actions/structure/repeat.js"
import Label from "./src/gui/label.js"
import {current} from "./src/variable/sprite.js"
import IntVariable from "./src/variable/int.js"
import Increment from "./src/actions/variable/increment.js"
import EnumVariable from "./src/variable/enum.js"
import IntIsEqual from "./src/functions/equal.js"
import Equate from "./src/actions/variable/int_equate.js"
import RandomFloat from "./src/functions/random_float.js"
import RandomSign from "./src/functions/random_sign.js"
import Mul from "./src/functions/mul.js"
import Pressed from "./src/functions/pressed.js"
import Decrement from "./src/actions/variable/decrement.js"
import Add from "./src/actions/variable/add.js"
import Clear from "./src/actions/layer/clear.js"
import {exportAll} from "./src/export.js"
import {importRoot, importTextures} from "./src/import.js"

project.loadTextures = () => {
    importTextures()
}

project.init = () => {
    importRoot()
    exportAll()
}

project.data = ` 
textures = Object {
	ship: Texture(#shipTexture, "http://localhost:63342/ModdableAsteroids/textures/ship.png")
	flame: Texture(#flameTexture, "http://localhost:63342/ModdableAsteroids/textures/flame.png")
	bullet: Texture(#bulletTexture, "http://localhost:63342/ModdableAsteroids/textures/bullet.png")
	asteroid: Texture(#asteroidTexture, "http://localhost:63342/ModdableAsteroids/textures/asteroid.png")
	explosion: Texture(#explosionTexture, "http://localhost:63342/ModdableAsteroids/textures/explosion.png")
}
root = Object(#1) {
	keys: [
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
	scene: [
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
			image: Image(#2) {
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
			image: Image(#3) {
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
		Label(#4) {
			centerX: 0
			centerY: 0
			halfWidth: 4
			halfHeight: 7.5
			items: [
				IntVariable(#score) {
					value: 0
					format: "Z8"
				}
			]
			horizontalAlign: 0
			verticalAlign: 0
		}, 
		Label(#5) {
			centerX: 0
			centerY: 0
			halfWidth: 4
			halfHeight: 7.5
			items: [
				"LEVEL ", 
				IntVariable(#level) {
					value: 0
				}
			]
			horizontalAlign: 1
			verticalAlign: 0
		}, 
		Label(#6) {
			centerX: 0
			centerY: 0
			halfWidth: 4
			halfHeight: 7.5
			items: [
				IntVariable(#lives) {
					value: 3
					format: "R ∆"
				}
			]
			horizontalAlign: 2
			verticalAlign: 0
		}, 
		Label(#7) {
			centerX: 0
			centerY: 0
			halfWidth: 4
			halfHeight: 7.5
			items: [
				""
			]
			horizontalAlign: 1
			verticalAlign: 1
		}
	]
	actions: [
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
						halfHeight: 9.25
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
								heightMul: 1.5
								widthMul: 1.5
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
									object: #7
									fieldName: "items"
									value: [
										"GAME OVER"
									]
								}, 
								Equate {
									variable: #state
									value: 2
								}
							]
							elseCode: [
								SetField {
									object: #7
									fieldName: "items"
									value: [
										"PRESS SPACE"
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
							object: #7
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
									value: IntVariable(#8) {
										value: 3
									}
								}, 
								Equate {
									variable: #score
									value: IntVariable(#9) {
										value: 0
									}
								}, 
								Equate {
									variable: #level
									value: IntVariable(#10) {
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
								heightMul: 1.25
								widthMul: 1.25
							}
							animationSpeed: Mul {
								value1: RandomFloat {
									from: 12
									to: 20
								}
								value2: RandomSign {}
							}
							position: Object(#11) {
								centerX: RandomFloat {
									from: -5.75
									to: 5.75
								}
								centerY: -9.25
							}
							size: 3
							angle: RandomFloat {
								from: 360
							}
							speed: RandomFloat {
								from: 2
								to: 3
							}
							imageAngle: 0
						}, 
						AddAction {
							sprite: #current
							action: Rotate {
								object: #current
								speed: RandomFloat {
									from: -3.141592653589793
									to: 3.141592653589793
								}
							}
						}
					]
				}, 
				Add {
					variable: #score
					value: 500
				}
			]
		}, 
		OnCollision {
			object1: #bullets
			object2: #asteroids
			code: [
				Create {
					layer: #explosions
					image: #explosionImages
					animationSpeed: 16
					position: #collisionSprite2
					size: 3
					angle: RandomFloat {
						from: 360
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
				}, 
				Add {
					variable: #score
					value: 100
				}
			]
		}
	]
	canvas: Canvas(#12) {
		centerX: 0
		centerY: 0
		halfWidth: 4.5
		halfHeight: 8
		angle: 0
		speed: 0
		viewport: Area(#13) {
			leftX: 0
			topY: 0
			width: 360
			height: 640
		}
	}
	background: "rgb(9, 44, 84)"
}
`
