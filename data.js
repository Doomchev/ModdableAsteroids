export let data = ` 
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