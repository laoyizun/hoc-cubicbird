// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers.registerTilemapFactory(function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level": return tiles.createTilemap(hex`1c00080001010101010101010101040404040404040405070707070707070706010101010101010101010404040404040404080a0a0a0a0a0a0a0a09010101010101010101010404040404040404080a0a0a0a0a0a0a0a09010102020202020201010404040404040404080a0a020202020a0a09010103030303030301010b0b0b0b0b0b0b0b080a0a0a0a0a0a0a0a09010101010303010101010c0c0c0c0c0c0c0c080a0a0a0a0a0a0a0a09010101010303010101010404040404040404080a0a0a0a0a0a0a0a09010101010303010101010404040404040404080a0a0a0a0a0a0a0a09`, img`
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
. . . . 2 2 . . . . . . . . . . . . . . . 2 . . . . . . 
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . . . . . . . . . 
`, [myTiles.transparency16,sprites.dungeon.floorLight2,sprites.dungeon.stairLadder,sprites.dungeon.floorDark2,myTiles.tile1,sprites.dungeon.darkGroundNorthWest0,sprites.dungeon.darkGroundNorthEast0,sprites.dungeon.darkGroundNorth,sprites.dungeon.darkGroundWest,sprites.dungeon.darkGroundEast,sprites.dungeon.darkGroundCenter,sprites.vehicle.roadIntersection3,sprites.vehicle.roadIntersection1], TileScale.Sixteen)
            case "level_0": return tiles.createTilemap(hex`1000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`, img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, [myTiles.transparency16], TileScale.Sixteen)
            case "level_1": return tiles.createTilemap(hex`0a0008000404040404040404040404040401020304040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404`, img`
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile2,myTiles.tile3,myTiles.tile4], TileScale.Sixteen)
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
