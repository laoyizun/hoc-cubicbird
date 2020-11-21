// % weight=100 color=#6699CC icon="\u2593"
// block="编程一小时" % groups='["做数学题"]'
namespace hocCubicbird {

    export enum Difficulty {
        有基础的大神,
        没有基础的小白
    }
    
    export enum Operator {
        //% block="add"
        ADD = 0,
        //% block="sub"
        SUB = 1,
        //% block="mul"
        MUL = 2,
        //% block="div"
        DIV = 3
    }

    //% blockId=div_operator
    //% block="除号"
    export function DIV():Operator{
        return Operator.DIV
    }

    //% blockId=mul_operator
    //% block="乘号"
    export function MUL():Operator{
        return Operator.MUL
    }

    //% blockId=sub_operator
    //% block="减号"
    export function SUB():Operator{
        return Operator.SUB
    }

    //% blockId=add_operator
    //% block="加号"
    export function ADD():Operator{
        return Operator.ADD
    }

    const PROBLEM_SIZE = 10
    let _difficulty = Difficulty.有基础的大神
    let _currentAnswer = NaN;

    let leftOpSprite :Sprite = null
    let opSprite :Sprite = null
    let rightOpSprite :Sprite = null
    let challengerSprite:Sprite = null
    let judgeSprite:Sprite = null


    //% blockId=start_test
    //% block="开始测验，我是 %difficulty"
    //% group="做数学题"
    export function startGame(difficulty:Difficulty) {

        tiles.setTilemap(tilemap`level`)

        _difficulty = difficulty

        leftOpSprite = sprites.create(img`
            . . . . f f f f . . . . .
            . . f f f f f f f f . . .
            . f f f f f f c f f f . .
            f f f f f f c c f f f c .
            f f f c f f f f f f f c .
            c c c f f f e e f f c c .
            f f f f f e e f f c c f .
            f f f b f e e f b f f f .
            . f 4 1 f 4 4 f 1 4 f . .
            . f e 4 4 4 4 4 4 e f . .
            . f f f e e e e f f f . .
            f e f b 7 7 7 7 b f e f .
            e 4 f 7 7 7 7 7 7 f 4 e .
            e e f 6 6 6 6 6 6 f e e .
            . . . f f f f f f . . . .
            . . . f f . . f f . . . .
        `)
        leftOpSprite.x -= 32
        leftOpSprite.y -= 20

        opSprite = sprites.create(img`
            . f f f . f f f f . f f f .
            f f f f f c c c c f f f f f
            f f f f b c c c c b f f f f
            f f f c 3 c c c c 3 c f f f
            . f 3 3 c c c c c c 3 3 f .
            . f c c c c 4 4 c c c c f .
            . f f c c 4 4 4 4 c c f f .
            . f f f b f 4 4 f b f f f .
            . f f 4 1 f d d f 1 4 f f .
            . . f f d d d d d d f f . .
            . . e f e 4 4 4 4 e f e . .
            . e 4 f b 3 3 3 3 b f 4 e .
            . 4 d f 3 3 3 3 3 3 c d 4 .
            . 4 4 f 6 6 6 6 6 6 f 4 4 .
            . . . . f f f f f f . . . .
            . . . . f f . . f f . . . .
        `)
        opSprite.y -= 20

        rightOpSprite = sprites.create(img`
            . . . . . f f f f . . . . .
            . . . f f 5 5 5 5 f f . . .
            . . f 5 5 5 5 5 5 5 5 f . .
            . f 5 5 5 5 5 5 5 5 5 5 f .
            . f 5 5 5 d b b d 5 5 5 f .
            f 5 5 5 b 4 4 4 4 b 5 5 5 f
            f 5 5 c c 4 4 4 4 c c 5 5 f
            f b b f b f 4 4 f b f b b f
            f b b 4 1 f d d f 1 4 b b f
            . f b f d d d d d d f b f .
            . f e f e 4 4 4 4 e f e f .
            . e 4 f 6 9 9 9 9 6 f 4 e .
            . 4 d c 9 9 9 9 9 9 c d 4 .
            . 4 f b 3 b 3 b 3 b b f 4 .
            . . f f 3 b 3 b 3 3 f f . .
            . . . . f f b b f f . . . .
        `)
        rightOpSprite.x += 32
        rightOpSprite.y -= 20

        challengerSprite = sprites.create(img`
            . . . . . . f f f f . . . . . .
            . . . . f f e e e e f f . . . .
            . . . f e e e f f e e e f . . .
            . . f f f f f 2 2 f f f f f . .
            . . f f e 2 e 2 2 e 2 e f f . .
            . . f e 2 f 2 f f 2 f 2 e f . .
            . . f f f 2 2 e e 2 2 f f f . .
            . f f e f 2 f e e f 2 f e f f .
            . f e e f f e e e e f e e e f .
            . . f e e e e e e e e e e f . .
            . . . f e e e e e e e e f . . .
            . . e 4 f f f f f f f f 4 e . .
            . . 4 d f 2 2 2 2 2 2 f d 4 . .
            . . 4 4 f 4 4 4 4 4 4 f 4 4 . .
            . . . . . f f f f f f . . . . .
            . . . . . f f . . f f . . . . .
        `)
        challengerSprite.y += 72
        challengerSprite.vy = -5

        judgeSprite = sprites.create(img`
            . . . f f f f f . . . .
            . . f e e e e e f f . .
            . f e e e e e e e f f .
            f e e e e e e e f f f f
            f e e 4 e e e f f f f f
            f e e 4 4 e e e f f f f
            f f e 4 4 4 4 4 f f f f
            f f e 4 4 f f 4 e 4 f f
            . f f d d d d 4 d 4 f .
            . . f b b d d 4 f f f .
            . . f e 4 4 4 e e f . .
            . . f 1 1 1 e d d 4 . .
            . . f 1 1 1 e d d e . .
            . . f 6 6 6 f e e f . .
            . . . f f f f f f . . .
            . . . . . f f f . . . .
        `)
        judgeSprite.x += 64
        judgeSprite.y += 20
    }

    //% blockId=give_answer
    //% block="提交答案 %answer"
    //% group="做数学题"
    export function giveAnswer(answer:number) {
        _currentAnswer = answer
    }

    function opString(operator:Operator):string {
        switch(operator) {
            case Operator.ADD:return "+";
            case Operator.SUB:return "-";
            case Operator.MUL:return "×";
            case Operator.DIV:return "÷";
        }
        return ""
    }

    let answerCallback :(leftOperand:number, operator:Operator, rightOperand:number)=>void = null

    //% blockId=on_problem
    //% group="做数学题"
    //% block="拿到题目"
    //% draggableParameters
    export function onProblem(cb: (leftOperand:number, operator:Operator, rightOperand:number)=>void) {
        answerCallback = cb  
    }

    export function onQuiz(cb:()=>void) {

    }

    control.runInParallel(function() {
        judgeSprite.say("下一位挑战者")
        while(challengerSprite.vy != 0) {
            pause(10)
        }
        judgeSprite.say("挑战开始")
        pause(1000)
        for(let i = 0; i < PROBLEM_SIZE; i++) {
            judgeSprite.say("请听题")
            leftOpSprite.say("")
            opSprite.say("")
            rightOpSprite.say("")

            let operator = Math.pickRandom([Operator.ADD,Operator.SUB,Operator.MUL,Operator.DIV])
            
            let leftOperand = randint(1, 100);
            let rightOperand = randint(1, 100);
            let correctAnswer = NaN
            switch (operator) {
                case Operator.ADD: 
                    correctAnswer = leftOperand + rightOperand; 
                    break;
                case Operator.SUB:         
                    // 保证正数
                    if (leftOperand < rightOperand) {
                        let temp = leftOperand
                        leftOperand = rightOperand
                        rightOperand = leftOperand
                    }
                    correctAnswer = leftOperand - rightOperand; 
                    break;
                case Operator.MUL:
                    correctAnswer = leftOperand * rightOperand; 
                    break;
                case Operator.DIV:
                    // 保证整除
                    let temp = leftOperand
                    leftOperand = rightOperand * leftOperand;
                    correctAnswer = rightOperand
                    rightOperand = temp
                    break;
            }

            leftOpSprite.say(leftOperand.toString())
            pause(500)
            opSprite.say(opString(operator))
            pause(500)
            rightOpSprite.say(rightOperand.toString())


            challengerSprite.say(".")
            pause(200)
            challengerSprite.say("..")
            pause(200)
            challengerSprite.say("...")
            pause(200)
            challengerSprite.say("....")
            pause(200)
            challengerSprite.say(".....")
            pause(200)

            answerCallback(leftOperand, operator, rightOperand)

            challengerSprite.say('答案是:' + _currentAnswer.toString())

            pause(1000)
            if (_currentAnswer == correctAnswer) {
                info.changeScoreBy(10)
                judgeSprite.say("回答正确")
                
            }  else {
                scene.cameraShake()
                judgeSprite.say("回答错误")
            }
            pause(1000)
        }

        judgeSprite.say("测验结束，总得分" + info.score())
    })

}