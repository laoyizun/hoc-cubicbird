hocCubicbird.onStatFinished(function () {
    hocCubicbird.submitHighestScore(0, 0)
    hocCubicbird.submitAvg(0)
})
hocCubicbird.onResultReceived(function (studentId, score) {
	
})
hocCubicbird.onProblem(function (leftOperand, operator, rightOperand) {
    hocCubicbird.giveAnswer(0)
})
