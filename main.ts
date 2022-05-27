function NewLevel () {
    tiles.placeOnRandomTile(Flicky, assets.tile`doorsmiddle`)
}
let Flicky: Sprite = null
Flicky = sprites.create(assets.image`flicky_front`, SpriteKind.Player)
controller.moveSprite(Flicky)
tiles.setCurrentTilemap(tilemap`level1`)
