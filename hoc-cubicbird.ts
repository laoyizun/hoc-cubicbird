// % weight=100 color=#6699CC icon="\u2593"
// block="编程一小时" % groups='["做数学题", "统计成绩"]'
namespace hocCubicbird {

    export enum Difficulty {
        有基础的大神,
        没有基础的小白
    }

    const MATH_QUIZ_SPRITE_KIND = SpriteKind.create()
    
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
    const RESULT_SIZE = 50
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

        _difficulty = difficulty

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

    let statCallback :(name:string, score:number) =>void = null

    //% blockId=on_stat
    //% group="统计成绩"
    //% block="拿到卷子"
    //% draggableParameters
    export function onStat(cb:(studentId:string, score:number)=>void) {
        statCallback = cb
    }

    let _submitAvg = 0
    let _submitHighestScore = 0
    let _submitHighestScoreCount = 0 

    export function submitAvg(avg:number) {
        _submitAvg = avg
    }

    export function submitHighestScore(highscore:number, highscoreCount:number) {
        _submitHighestScore = highscore
        _submitHighestScoreCount = highscoreCount
    }

    function clearMathQuizScene() {
        for (let sprite of sprites.allOfKind(MATH_QUIZ_SPRITE_KIND)) {
            sprite.destroy()
        }
    }

    function scoreStat() {

        tiles.setTilemap(tilemap`level_0`)

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

        judgeSprite.x += 48
        judgeSprite.y += 32

        challengerSprite = sprites.create(img`
            . . . . . f f 4 4 f f . . . . .
            . . . . f 5 4 5 5 4 5 f . . . .
            . . . f e 4 5 5 5 5 4 e f . . .
            . . f b 3 e 4 4 4 4 e 3 b f . .
            . . f 3 3 3 3 3 3 3 3 3 3 f . .
            . f 3 3 e b 3 e e 3 b e 3 3 f .
            . f 3 3 f f e e e e f f 3 3 f .
            . f b b f b f e e f b f b b f .
            . f b b e 1 f 4 4 f 1 e b b f .
            f f b b f 4 4 4 4 4 4 f b b f f
            f b b f f f e e e e f f f b b f
            . f e e f b d d d d b f e e f .
            . . e 4 c d d d d d d c 4 e . .
            . . e f b d b d b d b b f e . .
            . . . f f 1 d 1 d 1 d f f . . .
            . . . . . f f b b f f . . . . .
        `)
        challengerSprite.y -= 20

        judgeSprite.say("老师")
        pause(1000)
        judgeSprite.say("刚刚的数据考试卷子都改好了")
        pause(1000)
        judgeSprite.say("快点统计这次的成绩吧")
        pause(1000)
        
        let sum = 0
        let hs = 0
        let cnt = 0

        judgeSprite.say("开始统计吧")
        pause(500)
        challengerSprite.say("好")

        for (let i = 0; i < RESULT_SIZE; i++) {
            let speedRatio = Math.pow(10, i / 10)

            let score = randint(50, 100)
            let studentId = randint(1, 99) * 100 + i  

            sum += score
            if (score == hs){
                cnt += 1
            } else if (score > hs) {
                hs = score 
                cnt = 1
            } 

            judgeSprite.say("学号:" + studentId)
            pause(1000 / speedRatio)
            judgeSprite.say("成绩:" + score)

            let paperSprite = sprites.createProjectileFromSprite(img`
                . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
                1 1 f f f f 1 1 1 1 2 2 1 2 1 1
                1 1 f f f f 1 1 1 1 1 2 1 2 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 f f f f f 1 1 f f f f f 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 f f f f f 1 1 f f f f f 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 f f f f f 1 1 f f f f f 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 f f f f f 1 1 f f f f f 1 1
                . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
                . . 1 1 1 1 1 1 1 1 1 1 1 1 . .
            `, judgeSprite, 0, 0)
            paperSprite.follow(challengerSprite, 100)
            paperSprite.lifespan = 1000

            statCallback(studentId.toString(), score)

            challengerSprite.say(".")
            pause(100 / speedRatio)
            challengerSprite.say("..")
            pause(100 / speedRatio)
            challengerSprite.say("...")
            pause(100 / speedRatio)
            challengerSprite.say("....")
            pause(100 / speedRatio)
            challengerSprite.say(".....")
            pause(100 / speedRatio)
        }

        judgeSprite.say("统计好了吧")
        pause(1000)
        judgeSprite.say("我们核对一下统计结果")
        pause(1000)

        let avg = sum / RESULT_SIZE

        judgeSprite.say("平均分是？")

        challengerSprite.say(".")
        pause(50)
        challengerSprite.say("..")
        pause(50)
        challengerSprite.say("...")
        pause(50)
        challengerSprite.say("....")
        pause(50)
        challengerSprite.say(".....")
        pause(50)

        challengerSprite.say(_submitAvg.toString())
        pause(1000)

        if (avg == _submitAvg) {
            judgeSprite.say("嗯，正确!")
        } else {
            scene.cameraShake()
            judgeSprite.say("错了呀，应该是" + avg.toString())
        }
        pause(1000)


        judgeSprite.say("最高分是？")
        
        challengerSprite.say(".")
        pause(50)
        challengerSprite.say("..")
        pause(50)
        challengerSprite.say("...")
        pause(50)
        challengerSprite.say("....")
        pause(50)
        challengerSprite.say(".....")
        pause(50)

        challengerSprite.say(_submitHighestScore.toString())
        pause(1000)
        
        if (hs == _submitHighestScore) {
            judgeSprite.say("嗯，正确!")
        } else {
            scene.cameraShake()
            judgeSprite.say("错了呀，应该是" + hs.toString())
        }
        pause(1000)

        judgeSprite.say("最高分有几个人？")
        
        challengerSprite.say(".")
        pause(50)
        challengerSprite.say("..")
        pause(50)
        challengerSprite.say("...")
        pause(50)
        challengerSprite.say("....")
        pause(50)
        challengerSprite.say(".....")
        pause(50)

        challengerSprite.say(_submitHighestScoreCount.toString())
        pause(1000)

        if (cnt == _submitHighestScoreCount) {
            judgeSprite.say("嗯，正确!")
        } else {
            scene.cameraShake()            
            judgeSprite.say("错了呀，应该是" + hs.toString())
        }

    }

    function mathQuiz() {
        tiles.setTilemap(tilemap`level`)

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
        `, MATH_QUIZ_SPRITE_KIND)
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
        `, MATH_QUIZ_SPRITE_KIND)
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
        `, MATH_QUIZ_SPRITE_KIND)
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
        `, MATH_QUIZ_SPRITE_KIND)
        challengerSprite.y += 72
        challengerSprite.vy = -8

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
        `,MATH_QUIZ_SPRITE_KIND)
        judgeSprite.x += 64
        judgeSprite.y += 20

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

            let operator = Math.pickRandom([Operator.ADD, Operator.SUB, Operator.MUL, Operator.DIV])
            
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

        pause(3000)
    }

    control.runInParallel(function() {
        mathQuiz()

        clearMathQuizScene()

        scoreStat()
        
    })

}