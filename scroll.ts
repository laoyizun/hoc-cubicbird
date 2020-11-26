interface ProblemResult {
    line:string
    isCorrect:boolean
}

// 在此处添加您的代码
namespace scroll {
    const tickSignImage = img`
        . . . . . 1 1 1 1 1 1 1 . . . .
        . . . 1 1 . . . . . . . 1 1 . .
        . . 1 . . . . . . . . 7 . . 1 .
        . . 1 . . . . . . . 7 7 . . 1 .
        . 1 . . . . . . . . 7 . 7 . . 1
        . 1 . . . . . . . . 7 . . . . 1
        . 1 . . . . . . . 7 . . . . . 1
        . 1 . . . . . . . 7 . . . . . 1
        . 1 . . . . . . 7 . . . . . . 1
        . 1 . 7 . . . . 7 . . . . . . 1
        . 1 . . 7 . . . 7 . . . . . . 1
        . . 1 . . 7 . 7 . . . . . . 1 .
        . . 1 . . . 7 7 . . . . . . 1 .
        . . . 1 1 . . 7 . . . . 1 1 . .
        . . . . . 1 1 1 1 1 1 1 . . . .
        . . . . . . . . . . . . . . . .
    `;
    const crossSignImage = img`
        . . . . . 1 1 1 1 1 1 1 . . . .
        . . . 1 1 . . . . . . . 1 1 . .
        . . 1 2 . . . . . . . . . 2 1 .
        . . 1 . 2 . . . . . . . 2 . 1 .
        . 1 . . . 2 . . . . . 2 . . . 1
        . 1 . . . . 2 . . . 2 . . . . 1
        . 1 . . . . . 2 . 2 . . . . . 1
        . 1 . . . . . . 2 . . . . . . 1
        . 1 . . . . . 2 . 2 . . . . . 1
        . 1 . . . . 2 . . . 2 . . . . 1
        . 1 . . . 2 . . . . . 2 . . . 1
        . . 1 . 2 . . . . . . . 2 . 1 .
        . . 1 2 . . . . . . . . . 2 1 .
        . . . 1 1 . . . . . . . 1 1 . .
        . . . . . 1 1 1 1 1 1 1 . . . .
        . . . . . . . . . . . . . . . .
    `;

    export function textUp(problemResults:ProblemResult[]) {
        for (let result of problemResults) {
            textUpImpl(result.line, result.isCorrect)
            pause(1200) // line height / vy speed + 200 margin
        }
    }

    function textUpImpl(text:string, isCorrect:boolean) {
        let spriteImage = image.create(160, 20)
        spriteImage.print(text, 20, 4, 1, image.font8)
        spriteImage.drawTransparentImage(isCorrect?tickSignImage:crossSignImage, 140, 2)

        let sprite = sprites.create(spriteImage)
        sprite.y = 140
        sprite.vy = -20
    }

}