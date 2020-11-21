// % weight=100 color=#6699CC icon="\u2593"
// block="编程一小时" % groups='["做数学题"]'
namespace hoc_cubicbird {

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

    //% blockId=add_operator
    //% block="加号"
    export function ADD():Operator{
        return Operator.ADD
    }

    const PROBLEM_SIZE = 10
    let _difficulty = Difficulty.有基础的大神
    let _currentAnswer = NaN;


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

    //% blockId=on_problem
    //% group="做数学题"
    //% block="拿到题目"
    //% draggableParameters
    export function onProblem(cb: (leftOperand:number, operator:Operator, rightOperand:number)=>void) {
        for(let i = 0; i < PROBLEM_SIZE; i++) {
            let operator = Math.pickRandom([Operator.ADD,Operator.SUB,Operator.MUL,Operator.DIV])
            
            let leftOperand = randint(1, 100);
            let rightOperand = randint(1, 100);
            let correctAnswer = NaN
            switch (operator) {
                case Operator.ADD: 
                    correctAnswer = leftOperand + rightOperand; 
                    break;
                case Operator.SUB:         
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

            cb(leftOperand, operator, rightOperand)

            if (_currentAnswer == correctAnswer) {
                info.changeScoreBy(10)
            }
        }
    }
}