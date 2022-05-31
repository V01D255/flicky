namespace SpriteKind {
    export const chirp = SpriteKind.create()
    export const followchirp = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`doorsmiddle`, function (sprite, location) {
    previouschirp = Flicky
    chirpsleft += sprites.allOfKind(SpriteKind.followchirp).length * -1
    info.changeScoreBy(sprites.allOfKind(SpriteKind.followchirp).length * 100)
    sprites.destroyAllSpritesOfKind(SpriteKind.followchirp)
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
    chirpslist = []
    tiles.placeOnRandomTile(Flicky, assets.tile`doorsmiddle`)
    Flicky.setImage(assets.image`flicky_front`)
    for (let value of tiles.getTilesByType(assets.tile`chirp_spawn`)) {
        Chirp = sprites.create(assets.image`chirp_front`, SpriteKind.chirp)
        tiles.placeOnTile(Chirp, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        chirpsleft += 1
    }
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
let chirpsleft = 0
let previouschirp: Sprite = null
let Flicky: Sprite = null
Flicky = sprites.create(assets.image`flicky_front`, SpriteKind.Player)
controller.moveSprite(Flicky, 100, 0)
tiles.setCurrentTilemap(tilemap`level1`)
scene.cameraFollowSprite(Flicky)
NewLevel()
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
})
