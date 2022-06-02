namespace SpriteKind {
    export const chirp = SpriteKind.create()
    export const followchirp = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`doorsmiddle`, function (sprite, location) {
    streak = 1
    previouschirp = Flicky
    for (let index = 0; index < sprites.allOfKind(SpriteKind.followchirp).length; index++) {
        chirpsleft += -1
        info.changeScoreBy(streak * 20)
        if (streak > 10) {
            streak = 1
            info.changeLifeBy(1)
        }
        streak += 1
    }
    sprites.destroyAllSpritesOfKind(SpriteKind.followchirp)
    if (chirpsleft < 1) {
        level += 1
        NewLevel()
    }
})
function SpawnEnemies (ID: number) {
    if (ID == 1) {
        for (let value of tiles.getTilesByType(assets.tile`lizordspawn`)) {
            lizard = sprites.create(assets.image`lizard_placeholder`, SpriteKind.Enemy)
            tiles.placeOnTile(lizard, value)
            tiles.setTileAt(value, assets.tile`transparency16`)
        }
    } else {
        for (let value of tiles.getTilesByType(assets.tile`enem_spawn`)) {
            cat = sprites.create(assets.image`cat_enemy_front`, SpriteKind.Enemy)
            tiles.placeOnTile(cat, value)
        }
    }
}
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
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
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
sprites.onOverlap(SpriteKind.followchirp, SpriteKind.chirp, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.followchirp)
    chirpslist.push(otherSprite)
    otherSprite.follow(previouschirp, 100)
    previouschirp = otherSprite
})
let Chirp: Sprite = null
let chirpslist: Sprite[] = []
let flicky_direction = 0
let cat: Sprite = null
let lizard: Sprite = null
let chirpsleft = 0
let streak = 0
let previouschirp: Sprite = null
let Flicky: Sprite = null
let level = 0
let levels: tiles.TileMapData[] = []
levels = [tilemap`level1`, tilemap`level3`, tilemap`end`]
level = 0
Flicky = sprites.create(assets.image`flicky_front`, SpriteKind.Player)
controller.moveSprite(Flicky, 100, 0)
info.setLife(1)
NewLevel()
scene.cameraFollowSprite(Flicky)
previouschirp = Flicky
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
    if (cat.isHittingTile(CollisionDirection.Bottom)) {
        cat.ay = 0
    } else {
        cat.ay += 5
    }
})
