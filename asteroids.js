import {importProject, importTextures} from "./src/import.js"
import {exportProject} from "./src/export.js"
import {project} from "./src/project.js"

project.loadTextures = () => {
    importTextures()
}

project.init = () => {
    importProject()
    exportProject()
}

project.data = ` 
export.js:19 
textures: Object {
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
		limit: "Максимальное ускорениекорабля"
		dAngle: "Скорость вращения корабля"
	}
}
keys: []
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
		image: Image(#4) {
			texture: #flameTexture
			x: 0
			y: 0
			height: 64
			width: 64
		}
		angle: -1.5707963267948966
		speed: 0
	}, 
	Sprite(#5) {
		centerX: 0
		centerY: 0
		halfWidth: 0.5
		halfHeight: 0.5
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
	Label(#7) {
		centerX: 0
		centerY: 0
		halfWidth: 7
		halfHeight: 7
		items: [
			NumericVariable(#score) {
				value: 0
				format: "Z8"
			}
		]
		horizontalAlign: 0
		verticalAlign: 0
	}, 
	Label(#8) {
		centerX: 0
		centerY: 0
		halfWidth: 7
		halfHeight: 7
		items: [
			Loc(level), 
			NumericVariable(#level) {
				value: 0
			}
		]
		horizontalAlign: 1
		verticalAlign: 0
	}, 
	Label(#9) {
		centerX: 0
		centerY: 0
		halfWidth: 7
		halfHeight: 7
		items: [
			NumericVariable(#lives) {
				value: 3
				format: "R ∆"
			}
		]
		horizontalAlign: 2
		verticalAlign: 0
	}, 
	Label(#10) {
		centerX: 0
		centerY: 0
		halfWidth: 7
		halfHeight: 7
		items: [
			""
		]
		horizontalAlign: 1
		verticalAlign: 1
	}
]
actions: [
	LoopArea {
		object: #5
		area: Shape(#bounds) {
			centerX: 0
			centerY: 0
			halfWidth: 9.25
			halfHeight: 9.25
		}
	}, 
	Move {
		object: #5
	}, 
	Animate {
		sprite: #flame
		images: ImageArray(#flameImages) {
			texture: #flameTexture
			columns: 3
			rows: 3
		}
		speed: 16
		frame: 0
	}, 
	Constraint {
		sprite: #flame
		parent: #5
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
		parent: #5
		dAngle: 0
		distance: 1
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
enum: Object {
	state: Object(#12) {
		alive: 0
		dead: 1
		gameOver: 2
	}
	asteroidType: Object(#13) {
		big: Object(#14) {
			size: 3
			minSpeed: 2
			maxSpeed: 3
			minAnimSpeed: 12
			maxAnimSpeed: 20
			score: 100
			pieces: [
				Object(#15) {
					type: Object(#16) {
						size: 2
						minSpeed: 2
						maxSpeed: 2.5
						minAnimSpeed: 16
						maxAnimSpeed: 25
						score: 200
						pieces: [
							Object(#17) {
								type: Object(#18) {
									size: 1
									minSpeed: 3
									maxSpeed: 5
									minAnimSpeed: 16
									maxAnimSpeed: 25
									score: 300
									pieces: []
								}
								angle: 1.0471975511965976
							}, 
							Object(#19) {
								type: #18
								angle: -1.0471975511965976
							}
						]
					}
					angle: 0
				}, 
				Object(#20) {
					type: #18
					angle: 1.0471975511965976
				}, 
				Object(#21) {
					type: #18
					angle: -1.0471975511965976
				}
			]
		}
		medium: #16
		small: #18
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
canvas: Canvas {
	centerX: 0
	centerY: 0
	halfWidth: 8
	halfHeight: 8
	imageAngle: true
	angle: 0
	speed: 0
	viewport: Area(#24) {
		leftX: 0
		topY: 0
		width: 514
		height: 514
	}
}
background: "rgb(9, 44, 84)"
registry: Object {
	startingLives: 3
	levelBonus: 1000
	bounds: #bounds
	ship: Object(#26) {
		acceleration: 25
		deceleration: 15
		limit: 7.5
		dAngle: 180
	}
}
`