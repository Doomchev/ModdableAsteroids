import {importProject, importTextures} from "./src/import.js"
import {project} from "./src/project.js"
import {initUpdate} from "./asteroids_code.js"

project._loadTextures = () => {
    importTextures()
}

project._init = () => {
    importProject()
    initUpdate()
}

project._data = ` 
texture: Object {
	ship: Texture("textures/ship.png")
	flame: Texture("textures/flame.png")
	bullet: Texture("textures/bullet.png")
	asteroid: Texture("textures/asteroid.png")
	explosion: Texture("textures/explosion.png")
}
locale: "ru"
locales: Object {
	en: Object(#2) {
		level: "LEVEL "
		pressEnter: "PRESS ENTER"
		gameOver: "GAME OVER"
		left: "Turn left"
		right: "Turn right"
		forward: "Thrust"
		fire: "Fire"
		startingLives: "Starting lives"
		acceleration: "Ship acceleration"
		deceleration: "Ship deceleration"
		limit: "Max ship acceleration"
		dAngle: "Ship turning speed"
	}
	ru: Object(#3) {
		level: "УРОВЕНЬ "
		pressEnter: "НАЖМИТЕ ENTER"
		gameOver: "ИГРА ОКОНЧЕНА"
		left: "Повернуть влево"
		right: "Повернуть вправо"
		forward: "Ускоряться"
		fire: "Стрелять"
		startingLives: "Стартовые жизни"
		acceleration: "Ускорение корабля"
		deceleration: "Замедление корабля"
		limit: "Максимальное ускорение корабля"
		dAngle: "Скорость вращения корабля"
	}
}
key: Object {
	left: Key(#left) {
		code: "ArrowLeft"
	}
	right: Key(#right) {
		code: "ArrowRight"
	}
	forward: Key(#forward) {
		code: "ArrowUp"
	}
	fire: Key(#fire) {
		code: "Space"
	}
	continue: Key(#continue) {
		code: "Enter"
	}
}
scene: [
	Layer(#bullets) {
		items: []
	}, 
	Layer(#asteroids) {
		items: []
	}, 
	Sprite(#flameSprite) {
		centerX: -0.9
		centerY: 0
		width: 1
		height: 1
		image: Image(#5) {
			texture: #flameTexture
			x: 0
			y: 0
			height: 64
			width: 64
		}
		angle: -90
		speed: 0
	}, 
	Sprite(#shipSprite) {
		centerX: 0
		centerY: 0
		width: 1
		height: 1
		image: Image(#6) {
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
	Label(#scoreLabel) {
		centerX: 0
		centerY: 0
		width: 14
		height: 14
		items: [
			NumericVariable(#score) {
				value: 0
				format: "Z8"
			}
		]
		horizontalAlign: 0
		verticalAlign: 0
	}, 
	Label(#levelLabel) {
		centerX: 0
		centerY: 0
		width: 14
		height: 14
		items: [
			Loc(level), 
			NumericVariable(#level) {
				value: 0
			}
		]
		horizontalAlign: 1
		verticalAlign: 0
	}, 
	Label(#livesLabel) {
		centerX: 0
		centerY: 0
		width: 14
		height: 14
		items: [
			NumericVariable(#lives) {
				value: 3
				format: "R ∆"
			}
		]
		horizontalAlign: 2
		verticalAlign: 0
	}, 
	Label(#messageLabel) {
		centerX: 0
		centerY: 0
		width: 14
		height: 14
		items: [
			""
		]
		horizontalAlign: 1
		verticalAlign: 1
	}
]
actions: [
	LoopArea {
		object: #shipSprite
		area: Shape(#bounds) {
			centerX: 0
			centerY: 0
			width: 18.5
			height: 18.5
		}
	}, 
	Move {
		object: #shipSprite
	}, 
	Animate {
		sprite: #flameSprite
		images: ImageArray(#flameImages) {
			texture: #flameTexture
			columns: 3
			rows: 3
		}
		speed: 16
		frame: 0
	}, 
	Constraint {
		sprite: #flameSprite
		parent: #shipSprite
		dAngle: -1.5707963267948966
		distance: 0.9
		dAngle2: 3.141592653589793
	}, 
	Constraint {
		sprite: Sprite(#gun) {
			centerX: 0
			centerY: 0
			width: 1
			height: 1
			image: 1
			angle: 0
			speed: 0
		}
		parent: #shipSprite
		dAngle: 0
		distance: 0
		dAngle2: 0
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
	}
]
registry: Object {
	startingLives: 3
	levelBonus: 1000
	ship: Object(#8) {
		acceleration: 25
		deceleration: 15
		limit: 7.5
		dAngle: 180
	}
	state: Object(#9) {
		alive: 0
		dead: 1
		gameOver: 2
	}
	asteroidType: Object(#10) {
		big: Object(#11) {
			size: 3
			minSpeed: 2
			maxSpeed: 3
			minAnimSpeed: 12
			maxAnimSpeed: 20
			score: 100
			pieces: [
				Object(#12) {
					type: Object(#13) {
						size: 2
						minSpeed: 2
						maxSpeed: 2.5
						minAnimSpeed: 16
						maxAnimSpeed: 25
						score: 200
						pieces: [
							Object(#14) {
								type: Object(#15) {
									size: 1
									minSpeed: 3
									maxSpeed: 5
									minAnimSpeed: 16
									maxAnimSpeed: 25
									score: 300
									pieces: []
								}
								angle: 59.99999999999999
							}, 
							Object(#16) {
								type: #15
								angle: -59.99999999999999
							}
						]
					}
					angle: 0
				}, 
				Object(#17) {
					type: #15
					angle: 59.99999999999999
				}, 
				Object(#18) {
					type: #15
					angle: -59.99999999999999
				}
			]
		}
		medium: #13
		small: #15
	}
	objects: [
		ImageArray(#bulletImages) {
			texture: #bulletTexture
			columns: 1
			rows: 16
			xMul: 0.8958333333333334
			yMul: 0.4583333333333333
			heightMul: 3
			widthMul: 10.5
		}, 
		ImageArray(#asteroidImages) {
			texture: #asteroidTexture
			columns: 8
			rows: 4
			heightMul: 1.5
			widthMul: 1.5
		}, 
		ImageArray(#explosionImages) {
			texture: #explosionTexture
			columns: 4
			rows: 4
			heightMul: 2
			widthMul: 2
		}
	]
}
canvas: Canvas {
	centerX: 0
	centerY: 0
	width: 16
	height: 16
	imageAngle: 0
	angle: 0
	speed: 0
	viewport: Area(#20) {
		leftX: 0
		topY: 0
		width: 514
		height: 514
	}
}
background: "rgb(9, 44, 84)"
`