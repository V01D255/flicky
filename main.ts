enum ActionKind {
    Walking,
    Idle,
    Jumping,
    walkleft
}
namespace SpriteKind {
    export const chirp = SpriteKind.create()
    export const followchirp = SpriteKind.create()
    export const cat = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`doorsmiddle`, function (sprite, location) {
    streak = 1
    previouschirp = Flicky
    for (let index = 0; index < sprites.allOfKind(SpriteKind.followchirp).length; index++) {
        chirpsleft += -1
        info.changeScoreBy(streak * 20)
        if (streak > 10) {
            info.changeLifeBy(1)
        }
        streak += 1
    }
    sprites.destroyAllSpritesOfKind(SpriteKind.followchirp)
    if (chirpsleft < 1) {
        level += 1
        game.splash("LEVEL CLEAR")
        if (flawless) {
            game.splash("FLAWLESS VICTORY!")
            info.changeScoreBy(info.score())
            info.changeLifeBy(4)
        }
        NewLevel()
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (info.score() >= 500) {
        info.changeScoreBy(-500)
        if (flicky_direction == 0) {
            projectile = sprites.createProjectileFromSprite(assets.image`ball`, Flicky, -50, 0)
        } else {
            projectile = sprites.createProjectileFromSprite(assets.image`ball`, Flicky, 50, 0)
        }
    }
})
function SpawnEnemies (ID: number) {
    if (ID == 1) {
        for (let value of tiles.getTilesByType(assets.tile`lizordspawn`)) {
            lizard = sprites.create(assets.image`lizard_placeholder`, SpriteKind.Enemy)
            tiles.placeOnTile(lizard, value)
            lizard.vy += 1
            tiles.setTileAt(value, assets.tile`transparency16`)
        }
    } else {
        for (let value of tiles.getTilesByType(assets.tile`enem_spawn`)) {
            cat = sprites.create(assets.image`cat_enemy_front`, SpriteKind.cat)
            tiles.placeOnTile(cat, value)
        }
    }
}
scene.onHitWall(SpriteKind.cat, function (sprite, location) {
    if (tiles.tileAtLocationIsWall(location.getNeighboringLocation(CollisionDirection.Left))) {
        animation.runImageAnimation(
        sprite,
        assets.animation`cat_runright`,
        100,
        true
        )
        sprite.ax = 100
    } else if (tiles.tileAtLocationIsWall(location.getNeighboringLocation(CollisionDirection.Right))) {
        animation.runImageAnimation(
        sprite,
        assets.animation`cat_runleft`,
        100,
        true
        )
        sprite.ax = -100
    } else {
        if (Math.percentChance(30)) {
            sprite.ay = -200
        }
    }
})
sprites.onCreated(SpriteKind.cat, function (sprite) {
    if (Math.percentChance(50)) {
        animation.runImageAnimation(
        sprite,
        assets.animation`cat_runright`,
        100,
        true
        )
        sprite.ax = 100
    } else {
        animation.runImageAnimation(
        sprite,
        assets.animation`cat_runleft`,
        100,
        true
        )
        sprite.ax = -100
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Flicky.isHittingTile(CollisionDirection.Bottom)) {
        animation.stopAnimation(animation.AnimationTypes.All, Flicky)
        Flicky.vy = -100
        if (flicky_direction == 0) {
            animation.runImageAnimation(
            Flicky,
            assets.animation`flicky_jump0`,
            100,
            true
            )
        } else {
            animation.runImageAnimation(
            Flicky,
            assets.animation`flicky_jump`,
            100,
            true
            )
        }
    }
})
sprites.onOverlap(SpriteKind.followchirp, SpriteKind.cat, function (sprite, otherSprite) {
    flawless = false
    sprite.setKind(SpriteKind.chirp)
    sprite.follow(otherSprite)
    previouschirp = Flicky
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.cat, function (sprite, otherSprite) {
    otherSprite.destroy(effects.confetti, 500)
    info.changeScoreBy(200)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    flicky_direction = 0
    if (Flicky.isHittingTile(CollisionDirection.Bottom)) {
        animation.stopAnimation(animation.AnimationTypes.All, Flicky)
        animation.runImageAnimation(
        Flicky,
        assets.animation`runleft`,
        100,
        true
        )
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.chirp, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.followchirp)
    chirpslist.push(otherSprite)
    otherSprite.follow(previouschirp, 100)
    previouschirp = otherSprite
})
function NewLevel () {
    scene.setBackgroundColor(6)
    info.startCountdown(300)
    flawless = true
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.cat)
    tiles.setCurrentTilemap(levels[level])
    chirpslist = []
    tiles.placeOnRandomTile(Flicky, assets.tile`doorsmiddle`)
    Flicky.setImage(assets.image`flicky_front`)
    for (let value of tiles.getTilesByType(assets.tile`chirp_spawn`)) {
        Chirp = sprites.create(assets.image`chirp_front`, SpriteKind.chirp)
        tiles.placeOnTile(Chirp, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        chirpsleft += 1
    }
    SpawnEnemies(1)
    SpawnEnemies(2)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    flicky_direction = 1
    if (Flicky.isHittingTile(CollisionDirection.Bottom)) {
        animation.stopAnimation(animation.AnimationTypes.All, Flicky)
        animation.runImageAnimation(
        Flicky,
        assets.animation`runright`,
        100,
        true
        )
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.cat, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    flawless = false
    pause(500)
})
sprites.onOverlap(SpriteKind.followchirp, SpriteKind.chirp, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.followchirp)
    chirpslist.push(otherSprite)
    otherSprite.follow(previouschirp, 100)
    previouschirp = otherSprite
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    flawless = false
    info.changeLifeBy(-1)
    pause(500)
})
let Chirp: Sprite = null
let chirpslist: Sprite[] = []
let cat: Sprite = null
let lizard: Sprite = null
let projectile: Sprite = null
let flicky_direction = 0
let flawless = false
let chirpsleft = 0
let streak = 0
let previouschirp: Sprite = null
let Flicky: Sprite = null
let level = 0
let levels: tiles.TileMapData[] = []
levels = [
tilemap`level1`,
tilemap`level3`,
tilemap`level12`,
tilemap`level10`,
tilemap`end`
]
level = 0
Flicky = sprites.create(assets.image`flicky_front`, SpriteKind.Player)
controller.moveSprite(Flicky, 100, 0)
info.setLife(3)
NewLevel()
scene.cameraFollowSprite(Flicky)
previouschirp = Flicky
// gravity
game.onUpdate(function () {
    if (Flicky.isHittingTile(CollisionDirection.Bottom)) {
        Flicky.ay = 0
    } else {
        Flicky.ay += 5
    }
    if (Chirp.isHittingTile(CollisionDirection.Bottom)) {
        Chirp.ay = 0
    } else {
        Chirp.ay += 5
    }
    for (let value of sprites.allOfKind(SpriteKind.cat)) {
        if (value.isHittingTile(CollisionDirection.Bottom)) {
            value.ay = 0
        } else {
            value.ay += 5
        }
    }
})
// lizard behavior
game.onUpdate(function () {
    if (lizard.tileKindAt(TileDirection.Bottom, assets.tile`transparency16`) && (lizard.tileKindAt(TileDirection.Top, assets.tile`myTile1`) || (lizard.tileKindAt(TileDirection.Top, assets.tile`myTile0`) || lizard.tileKindAt(TileDirection.Top, assets.tile`myTile`)))) {
        animation.runImageAnimation(
        lizard,
        assets.animation`lizordleft`,
        50,
        true
        )
        lizard.setVelocity(-100, -1)
    } else if (lizard.tileKindAt(TileDirection.Bottom, assets.tile`myTile1`) || (lizard.tileKindAt(TileDirection.Bottom, assets.tile`myTile0`) || lizard.tileKindAt(TileDirection.Bottom, assets.tile`myTile`))) {
        animation.runImageAnimation(
        lizard,
        assets.animation`lizordleft0`,
        50,
        true
        )
        lizard.setVelocity(100, 1)
    } else if (lizard.tileKindAt(TileDirection.Right, assets.tile`myTile`)) {
        animation.runImageAnimation(
        lizard,
        assets.animation`lizordleft2`,
        50,
        true
        )
        lizard.setVelocity(1, -100)
    } else if (lizard.tileKindAt(TileDirection.Left, assets.tile`myTile1`) || lizard.tileKindAt(TileDirection.Bottom, assets.tile`transparency16`)) {
        animation.runImageAnimation(
        lizard,
        assets.animation`lizordleft1`,
        50,
        true
        )
        lizard.setVelocity(-1, 100)
    } else {
        lizard.setVelocity(0, 100)
    }
})
game.onUpdateInterval(11000, function () {
    cat = sprites.create(assets.image`cat_enemy_front`, SpriteKind.cat)
    tiles.placeOnRandomTile(cat, assets.tile`enem_spawn`)
})
