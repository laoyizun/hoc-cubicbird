// % weight=100 color=#6699CC icon="\u2593"
// block="编程一小时" % groups='["做数学题", "统计成绩"]'
namespace hocCubicbird {

    export enum Level {
        第一关,
        第二关
    }

    const MATH_QUIZ_SPRITE_KIND = SpriteKind.create()
    const JUDGE_SPRITE_KIND = SpriteKind.create()
    
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

    const PROBLEM_SIZE = 10 //测试修改：第一关题目减少
    const RESULT_SIZE = 50
    let _level = Level.第一关
    let _currentAnswer = NaN;

    let challengerName :string = "方块鸟"

    let leftOpSprite :Sprite = null
    let opSprite :Sprite = null
    let rightOpSprite :Sprite = null
    let challengerSprite:Sprite = null
    let judgeSprite:Sprite = null

    interface Result {

        problemLines:ProblemResult[]

        level1Correct:number
        level2avgCorrect:boolean
        level2hsCorrect:boolean
        level2hsCountCorrect:boolean
    }

    let _result:Result  = {

        problemLines:[],
        level1Correct:0,
        level2avgCorrect:false,
        level2hsCorrect:false,
        level2hsCountCorrect:false
    }


    //% blockId=start_test
    //% block="我是 %name 开始 %level"
    //% group="做数学题"
    export function startGame(name:string, level:Level) {
        challengerName = name
        _level = level
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

    let statFinishedCallback : ()=>void = null


    //% blockId=on_stat_finished
    //% group="统计成绩"
    //% block="统计完成后"
    //% draggableParameters
    export function onStatFinished(cb:()=>void) {
        statFinishedCallback = cb
    }

    //% blockId=on_problem
    //% group="做数学题"
    //% block="拿到题目"
    //% draggableParameters
    export function onProblem(cb: (leftOperand:number, operator:Operator, rightOperand:number)=>void) {
        answerCallback = cb  
    }

    let statCallback :(name:string, score:number) =>void = null

    //% blockId=on_result_received
    //% group="统计成绩"
    //% block="拿到卷子"
    //% draggableParameters
    export function onResultReceived(cb:(studentId:string, score:number)=>void) {
        statCallback = cb
    }

    let _submitAvg = 0
    let _submitHighestScore = 0
    let _submitHighestScoreCount = 0 

    //% blockId=submit_avg
    //% group="统计成绩"
    //% block="提交平均分 %avg"
    export function submitAvg(avg:number) {
        _submitAvg = avg
    }

    //% blockId=submit_hs
    //% group="统计成绩"
    //% block="提交最高分 %highscore 及最高分人数 %highscoreCount"
    export function submitHighestScore(highscore:number, highscoreCount:number) {
        _submitHighestScore = highscore
        _submitHighestScoreCount = highscoreCount
    }

    function clearMathQuizScene() {
        for (let sprite of sprites.allOfKind(MATH_QUIZ_SPRITE_KIND)) {
            sprite.destroy()
        }
    }

    function clearScoreStatScene() {
        challengerSprite.destroy()
        // judgeSprite.destroy()
    }

    function intermission() {
        //过场动画 -begin--
        scene.onOverlapTile(JUDGE_SPRITE_KIND, myTiles.tile5, function(sprite: Sprite, location: tiles.Location) {
            sprite.vx = 0
        })

        judgeSprite.setImage(img`
            . . . . f f f f f . . .
            . . f f e e e e e f . .
            . f f e e e e e e e f .
            f f f f e e e e e e e f
            f f f f f e e e 4 e e f
            f f f f e e e 4 4 e e f
            f f f f 4 4 4 4 4 e f f
            f f 4 e 4 f f 4 4 e f f
            . f 4 d 4 d d d d f f .
            . f f f 4 d d b b f . .
            . . f e e 4 4 4 e f . .
            . . 4 d d e 1 1 1 f . .
            . . e d d e 1 1 1 f . .
            . . f e e f 6 6 6 f . .
            . . . f f f f f f . . .
            . . . . f f f . . . . .
        `)
        scene.cameraFollowSprite(judgeSprite)
        judgeSprite.say("改好卷子了")
        pause(1000)
        judgeSprite.say("要去统计分数")
        judgeSprite.vx = 50//测试修改速度十倍
        pause(3000)//测试修改时间减少十倍
        judgeSprite.say("")
        scene.cameraFollowSprite(challengerSprite)
        pause(500)

        // TODO 此处有bug，下面两句较长的话都没有输出；
        judgeSprite.say("老师")
        pause(1000)
        judgeSprite.say("刚刚的数据考试的卷子都改好了")
        pause(1000)
        judgeSprite.say("快点统计这次的成绩吧")
        pause(1000)

        //过场动画 -end--
    }


    function scoreStat() {

        //tiles.setTilemap(tilemap`level`)

        // judgeSprite = sprites.create(img`
        //     . . . f f f f f . . . .
        //     . . f e e e e e f f . .
        //     . f e e e e e e e f f .
        //     f e e e e e e e f f f f
        //     f e e 4 e e e f f f f f
        //     f e e 4 4 e e e f f f f
        //     f f e 4 4 4 4 4 f f f f
        //     f f e 4 4 f f 4 e 4 f f
        //     . f f d d d d 4 d 4 f .
        //     . . f b b d d 4 f f f .
        //     . . f e 4 4 4 e e f . .
        //     . . f 1 1 1 e d d 4 . .
        //     . . f 1 1 1 e d d e . .
        //     . . f 6 6 6 f e e f . .
        //     . . . f f f f f f . . .
        //     . . . . . f f f . . . .
        // `)

        //judgeSprite.x += 48
        //judgeSprite.y += 32
        
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
        challengerSprite.x += 288//更改：位置需要右编移动十八格


        intermission()
        
                
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
            // paperSprite.vy = -100//更改：paper先往上移动半秒，防止撞墙销毁

            // pause(500)
            paperSprite.follow(challengerSprite, 100)
            paperSprite.lifespan = 1000    

            statCallback(studentId.toString(), score)

            challengeThinks(5, 100 / speedRatio)
            
        }

        pause(1000)

        judgeSprite.say("统计好了吧")
        pause(1000)
        judgeSprite.say("我们核对一下统计结果")
        pause(1000)

        statFinishedCallback()

        let avg = sum / RESULT_SIZE

        judgeSprite.say("平均分是？")

        challengeThinks(5, 50)

        challengerSprite.say(_submitAvg.toString())
        pause(1000)

        if (avg == _submitAvg) {
            _result.level2avgCorrect = true
            judgeSprite.say("嗯，正确!")
        } else {
            scene.cameraShake()
            judgeSprite.say("错了呀，应该是" + avg.toString())
        }
        pause(1000)


        judgeSprite.say("最高分是？")
        
        challengeThinks(5, 50)

        challengerSprite.say(_submitHighestScore.toString())
        pause(1000)
        
        if (hs == _submitHighestScore) {
            _result.level2hsCorrect = true
            judgeSprite.say("嗯，正确!")
        } else {
            scene.cameraShake()
            judgeSprite.say("错了呀，应该是" + hs.toString())
        }
        pause(1000)

        judgeSprite.say("最高分有几个人？")
        
        challengeThinks(5, 50)

        challengerSprite.say(_submitHighestScoreCount.toString())
        pause(1000)

        if (cnt == _submitHighestScoreCount) {
            _result.level2hsCountCorrect = true
            judgeSprite.say("嗯，正确!")
        } else {
            scene.cameraShake()            
            judgeSprite.say("错了呀，应该是" + hs.toString())
        }

    }

    function challengeThinks(times:number, pauseMillis:number) {
        let str = ""
        for (let i = 0;i < times;i++) {
            str += "."
            challengerSprite.say(str)
            pause(pauseMillis)    
        }
    }

    function mathQuiz() {
        tiles.setTilemap(tilemap`level`)//设置场景

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
        `, JUDGE_SPRITE_KIND)
        judgeSprite.x += 64
        judgeSprite.y += 20

        judgeSprite.say("下一位挑战者")

        control.runInParallel(function() {
            pause(1000)
            judgeSprite.say(challengerName)            
        })

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
                        rightOperand = temp
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

            challengeThinks(5, 200)

            answerCallback(leftOperand, operator, rightOperand)

            challengerSprite.say('答案是:' + _currentAnswer.toString())


            const lineForResult = leftOperand.toString() + opString(operator) + rightOperand.toString() + "=" + _currentAnswer.toString()
            pause(1000)
            if (_currentAnswer == correctAnswer) {
                _result.problemLines.push({
                    line: lineForResult,
                    isCorrect:true
                })
                _result.level1Correct += 1
                info.changeScoreBy(10)
                judgeSprite.say("回答正确")
            }  else {
                _result.problemLines.push({
                    line: lineForResult,
                    isCorrect:false
                })
                scene.cameraShake()
                judgeSprite.say("回答错误")
            }
            pause(1000)
        }

        judgeSprite.say("测验结束，总得分" + info.score())

        pause(3000)
    }

    function summary() {

        tiles.placeOnTile(judgeSprite, tiles.getTileLocation(9,1))
        judgeSprite.say(challengerName)

        tiles.setTilemap(tilemap`level_1`)
        scroll.textUp(_result.problemLines)

    }

    control.runInParallel(function() {
        if (_level === Level.第一关) {
            mathQuiz()

            clearMathQuizScene()
        }
        scoreStat()

        clearScoreStatScene()

        summary()

        
    })

}
