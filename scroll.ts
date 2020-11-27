interface ProblemResult {
    line:string
    isCorrect:boolean
    oneline:boolean
}

// 在此处添加您的代码
namespace scroll {
    const tickSignImage = img`
        . 1 1 1 1 1 . .
        1 . . . . 7 1 .
        1 . . . 7 7 1 .
        1 . . 7 7 6 1 .
        1 7 . 7 6 . 1 .
        1 . 7 6 . . 1 .
        . 1 1 1 1 1 . .
        . . . . . . . .
    `;
    const crossSignImage = img`
        . 1 1 1 1 1 . .
        1 2 . . . 2 1 .
        1 . 2 . 2 . 1 .
        1 . . 2 . . 1 .
        1 . 2 . 2 . 1 .
        1 2 . . . 2 1 .
        . 1 1 1 1 1 . .
        . . . . . . . .
    `;

    const LINE_SPRITE_KIND = SpriteKind.create()

    export function textUp(problemResults:ProblemResult[]) {
        for (let i = 0; i < problemResults.length; i++) {

            let result = problemResults[i]
            if (result.oneline) {
                textUpImpl(result.line, result.isCorrect, 0, true)
            } else {
                textUpImpl(problemResults[i].line, problemResults[i].isCorrect, -1,false)
                textUpImpl(problemResults[i+1].line, problemResults[i+1].isCorrect, 1, false)
                i++
            }

            pause(1200) // line height / vy speed + 200 margin
        }
    }

    
    function textUpImpl(text:string, isCorrect:boolean, sign:number, oneline:boolean) {

        let spriteImage = image.create(oneline?160:80, 10)
        spriteImage.fill(15)
        spriteImage.print(text, 10, 1, 1, image.font8)
        spriteImage.drawTransparentImage(isCorrect?tickSignImage:crossSignImage, oneline?150:70, 1)

        let sprite = sprites.create(spriteImage, LINE_SPRITE_KIND)
        sprite.x += 40*sign
        
        
        sprite.y = 140
        sprite.vy = -20
    }

    sprites.onOverlap(LINE_SPRITE_KIND, LINE_SPRITE_KIND, function(sprite: Sprite, otherSprite: Sprite) {
        otherSprite.vy = 0
    })

}