'use strict'
window.addEventListener('contextmenu', (e) => e.preventDefault())

var FLAG_IMG = '<img class="flag-img" src="img/flag.png" />'
var MINE_IMG = '<img class="mine-img" src="img/mine.png" />'
var MINE_STRIKE_IMG = '<img class="mine-img" src="img/minestrike.png" />'

var elHint = (document.querySelector('.hints-count').onclick = getHint)

var gMinedStartInitiate = []
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: 3,
    hintsCount: 3,
}
var gLevel = {
    sizeRows: 8,
    sizeCols: 8,
    mines: 0,
}
var isHintMode = false
var gBoard
var gMaxMinesAllowed = 12
var gMinePositions = []
var gCells = []
var gCellId = 1
var gActions = 0
var gTotalEmptyCells = 0
var gCellsRemainingToWin = 0
var gFlagsCount = 0
var gTotalSeconds = 0
var gIntervalID
var gStartTime
var gExtraStart = false
var gExpandEmptyNeighbors = []
var gExtraStartCells = []
var gEmptyCellsExpands = []
var gCurrentEmptyCellsExpand = []

function initGame() {
    resetGlobals()
    buildBoard(gLevel.sizeRows, gLevel.sizeCols)
    setMinesNegsCount()
    renderBoard()
    addEventListenersForCells()
    setCounters()
}
function resetGlobals() {
    var elBoard = document.querySelector('.board')
    elBoard.style.display = 'table'
    endTimer()
    var elMinutes = document.querySelector('.minutes')
    var elSeconds = document.querySelector('.seconds')
    elMinutes.innerText = '00'
    elSeconds.innerText = '00'
    gTotalSeconds = 0
    gIntervalID
    gStartTime
    gCellId = 1
    gActions = 0
    gTotalEmptyCells = 0
    gFlagsCount = 0
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        livesCount: 3,
        hintsCount: 3,
    }
    gLevel.mines = 0
    setCounters()
    var elSmily = document.querySelector('.smily')
    elSmily.innerHTML = '<span class="smily-text">Touch me to RESET</span>😄'
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}
function buildBoard(Rows, Cols) {
    gBoard = []
    gCells = []
    for (var i = 0; i < Rows; i++) {
        var row = []
        for (var j = 0; j < Cols; j++) {
            var cell = {
                cellId: gCellId++,
                pos: { i: i, j: j },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                // isMine: mineDeploy(),
                isMarked: false,
            }
            gCells.push({ i, j })
            row.push(cell)
        }
        gBoard.push(row)
    }
    for (var i = 0; i < gMaxMinesAllowed; i++) {
        gCells = shuffle(gCells)
        var newMinePos = drawNum(gCells)
        gBoard[newMinePos.i][newMinePos.j].isMine = true
        gLevel.mines++
    }
    gCellsRemainingToWin = gLevel.sizeCols * gLevel.sizeCols - gLevel.mines
    gTotalEmptyCells = gCellsRemainingToWin
}
function levelSelect(v) {
    //  console.log(v.target.id)
    var levelName = v.target.id
    if (!v.target.value) {
        gLevel.sizeRows = 8
        gLevel.sizeCols = 8
        gMaxMinesAllowed = 12
    } else {
        gLevel.sizeRows = +v.target.value.split('-')[0]
        gLevel.sizeCols = +v.target.value.split('-')[1]
        gMaxMinesAllowed = +v.target.value.split('-')[2]
    }
    var elChoice = document.querySelector('.choice')
    elChoice.innerText =
        'Level Choice: ' +
        levelName +
        ' ' +
        gLevel.sizeRows +
        '*' +
        gLevel.sizeCols
    initGame()

    // console.log(v)
    // if (!v) return
    // var levelName = v.target.id
    // console.log(v.target.value)
    // gLevel.sizeRows = v.target.value.split('-')[0]
    // gLevel.sizeCols = v.target.value.split('-')[1]
    // gMaxMinesAllowed = v.target.value.split('-')[2]
    // console.log('gMaxMinesAllowed:', gMaxMinesAllowed)

    // var elChoice = document.querySelector('.choice')
    // elChoice.innerText =
    //     'Level Choice: ' +
    //     levelName +
    //     ' ' +
    //     gLevel.sizeRows +
    //     '*' +
    //     gLevel.sizeCols
    //     initGame()
}
function getHint() {
    if (gGame.hintsCount > 0) {
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'
        var elSmily = document.querySelector('.smily')
        elSmily.innerHTML =
            '<span class="smily-text">Touch me to RESET</span>💡'
        isHintMode = true
        console.log('test')
    } else {
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'
        elModal.style.color = 'red'
        elModal.innerText = 'Sorry, out of 💡HINTS💡'
        setTimeout(() => {
            var elModal = document.querySelector('.modal')
            elModal.style.display = 'none'
        }, 3000)
    }
}
function setCounters() {
    var counters = document.querySelectorAll('.counters>h2')
    var elHints = document.querySelector('.hints-count')
    counters[0].innerText = 'Mines count: ' + gLevel.mines
    counters[1].innerText = 'Actions count: ' + gActions
    counters[2].innerText = 'Total empty cells: ' + gTotalEmptyCells
    counters[3].innerText = 'Cells remaining to win: ' + gCellsRemainingToWin
    counters[4].innerText = 'Flags Count: ' + gFlagsCount
    var elLives = document.querySelector('.lives-count')
    elLives.innerText = 'Lives left: ' + gGame.livesCount
    var hintsStr = ''
    for (var i = 0; i < gGame.hintsCount; i++) {
        hintsStr += '💡'
    }
    elHints.innerText = `Hints left: ${hintsStr}`
}
function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var neighborsCount = countNeighbors(i, j)
            gBoard[i][j].minesAroundCount = neighborsCount
        }
    }
}
function countNeighbors(cellI, cellJ) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine === true) neighborsCount++
        }
    }
    return neighborsCount
}
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            var currCellPos = gBoard[i][j].pos
            var currCellId = gBoard[i][j].cellId
            var cellClass =
                getClassName(currCellPos) + ' id-' + currCellId + ' '
            var cellContent = ''
            if (currCell.isMine === true) {
                cellClass += 'mine' + ' '
                cellContent += MINE_IMG
            } else {
                cellClass +=
                    'clear ' + 'negs-' + currCell.minesAroundCount + ' '
                cellContent = currCell.minesAroundCount + ''
            }
            if (currCell.isMarked === true) {
                cellClass += 'flag' + ' '
                cellContent = FLAG_IMG
            }
            var visibilityClass = currCell.isShown ? 'show ' : 'hide '
            strHTML += `\t<td class="td-${currCellId} closed"><div class="${cellClass} ${visibilityClass}" data-long-press-delay="500" oncontextmenu = "cellRightClicked(event, this,${i} ,${j} , ${currCellId})" onclick="cellLeftClicked(event, this,${i} ,${j} , ${currCellId})">${cellContent}</div></td> \n`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}
function getClassName(location) {
    var cellClass = 'cell cell-' + location.i + '-' + location.j
    return cellClass
}
function cellLeftClicked(event, elCell, i, j, currCellId) {
    var cell = gBoard[i][j]
    if (isHintMode === true) {
        isHintMode = false
        gGame.hintsCount--
        var elSmily = document.querySelector('.smily')
        elSmily.innerHTML =
            '<span class="smily-text">Touch me to RESET</span>😄'
        setCounters()
        var cellI = i
        var cellJ = j
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue

                var classStr = '.td-' + cell.cellId
                var elTableCell = document.querySelector(classStr)
                elTableCell.classList.remove('closed')
                elTableCell.classList.add('opened')
                var cellSelector = '.cell-' + i + '-' + j
                var elShowCell = document.querySelector(cellSelector)
                elShowCell.classList.add('show')
                elShowCell.classList.remove('hide')
            }
        }
        setTimeout(() => {
            renderBoard()
        }, 3000)
        console.log('gGame.hintsCount:', gGame.hintsCount)

        return
    }

    if (gGame.isOn === false && gActions !== 0) return
    if (cell.isMarked === true || cell.isShown) return
    if (gActions === 0 && cell.isMine === true) {
        gMinedStartInitiate = [event, elCell, i, j, currCellId]
        console.log("Bad luck first step on mine doesn't count :)")
        initGame()
        cellLeftClicked(
            gMinedStartInitiate[0],
            gMinedStartInitiate[1],
            gMinedStartInitiate[2],
            gMinedStartInitiate[3],
            gMinedStartInitiate[4]
        )
        renderBoard()
        return
    }
    if (gActions === 0 && cell.isMine === false) {
        cell.isShown = true
        var classStr = '.td-' + cell.cellId
        var elTableCell = document.querySelector(classStr)
        elTableCell.classList.remove('closed')
        elTableCell.classList.add('opened')
        elCell.classList.add('show')
        elCell.classList.remove('hide')
        gActions++
        gCellsRemainingToWin--
        if (cell.minesAroundCount === 0) {
            expandShown(elCell, i, j)
        }
        setCounters()
        gGame.isOn = true
        if (gFlagsCount === 0) startTimer()
        return
    }
    if (!cell.isShown && !cell.isMine) {
        cell.isShown = true

        var classStr = '.td-' + cell.cellId
        var elTableCell = document.querySelector(classStr)
        elTableCell.classList.remove('closed')
        elTableCell.classList.add('opened')

        elCell.classList.toggle('show')
        elCell.classList.toggle('hide')
        gActions++
        gCellsRemainingToWin--
        if (cell.minesAroundCount === 0) {
            expandShown(elCell, i, j)
        }
    }
    if (cell.isMine === true) {
        if (gGame.livesCount > 1) {
            var elModal = document.querySelector('.modal')
            elModal.style.display = 'block'
            elModal.style.color = 'red'
            gGame.livesCount--
            elModal.innerText = `You stepped on MINE, be carful ${gGame.livesCount} lives left...`
            var elSmily = document.querySelector('.smily')
            elSmily.innerHTML =
                '<span class="smily-text">Touch me to RESET</span>🤯'
            elCell.classList.toggle('show')
            elCell.classList.toggle('hide')
            elCell.style.backgroundColor = 'red'
            setTimeout(() => {
                var elModal = document.querySelector('.modal')
                elModal.style.display = 'none'
                elCell.classList.toggle('show')
                elCell.classList.toggle('hide')
                elCell.style.backgroundColor = 'initial'
                var elSmily = document.querySelector('.smily')
                elSmily.innerHTML =
                    '<span class="smily-text">Touch me to RESET</span>😄'
            }, 3000)
        } else {
            cell.isShown = true
            elCell.classList.toggle('show')
            elCell.classList.toggle('hide')
            elCell.style.backgroundColor = 'red'
            gameOver(cell.cellId)
            var elSmily = document.querySelector('.smily')
            elSmily.innerHTML =
                '<span class="smily-text">Touch me to RESET</span>🤯'
        }
    }
    setCounters()
    if (gTotalEmptyCells === gActions && gFlagsCount === gLevel.mines) {
        victory()
    }
}
function renderEndGame() {
    var count = 1
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cellIdStr = '.id-' + count
            var elCell = document.querySelector(cellIdStr)
            var tdCellIdStr = '.td-' + count
            var elTableCell = document.querySelector(tdCellIdStr)
            if (gBoard[i][j].isMarked) {
                elTableCell.classList.remove('closed')
                elTableCell.classList.add('opened')
                elCell.classList.add('show')
                elCell.classList.remove('hide')
                // elTableCell.style.backgroundColor = 'blue'
            } else if (gBoard[i][j].isMine) {
                elTableCell.classList.remove('closed')
                elTableCell.classList.add('opened')
                elCell.classList.add('show')
                elCell.classList.remove('hide')
                // elTableCell.style.backgroundColor = 'red'
            } else {
                // elTableCell.style.backgroundColor = 'green'
            }
            count++
        }
    }
}
function gameOver(cellId) {
    gGame.isOn = false
    if (gActions === 0) gActions = 1
    renderEndGame()
    var cellIdStr = '.td-' + cellId
    var elTableCell = document.querySelector(cellIdStr)
    elTableCell.style.backgroundColor = 'red'
    // elTableCell.innerHTML = MINE_STRIKE_IMG
    elTableCell.classList.remove('closed')
    elTableCell.classList.add('opened')
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.style.color = 'red'
    elModal.innerText = 'GAME OVER!'
    endTimer()
}
function victory() {
    gGame.isOn = false
    var elBoard = document.querySelector('.board')
    elBoard.style.display = 'none'
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.style.color = 'blue'
    elModal.innerText = 'Great! You WON!'
    var elSmily = document.querySelector('.smily')
    elSmily.innerHTML = '<span class="smily-text">Touch me to RESET</span>🥳'
    endTimer()
}
function cellRightClicked(event, elCell, i, j) {
    // console.log('cell right clicked')
    var cell = gBoard[i][j]
    // elCell = document.querySelector('.cell'+i+'-'+j)
    if (gGame.isOn === false && gActions !== 0) return
    if (cell.isShown) return
    if (cell.isMarked === false) {
        if (gActions === 0) startTimer()
        var classStr = 'cell-' + i + '-' + j
        var newCellContent = `<img class="flag-img ${classStr} show" src="img/flag.png" />`
        gFlagsCount++
    } else {
        var newCellContent = cell.isMine ? MINE_IMG : cell.minesAroundCount
        gFlagsCount--
    }
    elCell.classList.toggle('show')
    elCell.classList.toggle('hide')
    cell.isMarked = !cell.isMarked
    var cellPos = { i: i, j: j }
    renderCell(cellPos, newCellContent)
    setCounters()

    if (gTotalEmptyCells === gActions && gFlagsCount === gLevel.mines) {
        victory()
    }
}
function renderCell(location, value) {
    var cellSelector = '.cell-' + location.i + '-' + location.j
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}
function expandShown(elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (
                gBoard[i][j].isMine === false &&
                gBoard[i][j].isShown === false
            ) {
                var cell = gBoard[i][j]
                cell.isShown = true
                gActions++
                gCellsRemainingToWin--
                var classStr = '.td-' + cell.cellId
                var elTableCell = document.querySelector(classStr)
                elTableCell.classList.remove('closed')
                elTableCell.classList.add('opened')
                var cellSelector = '.cell-' + i + '-' + j
                var elCell = document.querySelector(cellSelector)
                elCell.classList.add('show')
                elCell.classList.remove('hide')

                if (cell.minesAroundCount === 0) {
                    gEmptyCellsExpands.push([elCell, i, j])
                }
            }
        }
    }
    gCurrentEmptyCellsExpand = []
    if (gEmptyCellsExpands === []) return
    for (var eCell of gEmptyCellsExpands) {
        gCurrentEmptyCellsExpand.push(eCell)
    }

    gEmptyCellsExpands = []
    for (var eCell of gCurrentEmptyCellsExpand) {
        expandShown(eCell[0], eCell[1], eCell[2])
    }
}
function addEventListenersForCells() {
    var count = 1
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var countStr = count + ''
            var classStr = '.td-' + countStr
            var elCell = document.querySelector(classStr)
            elCell.addEventListener('long-press', function (e, elCell) {
                e.preventDefault()
                console.log('e.target.classList:', e.target.classList)
                var cellClass = '.' + e.target.classList[2] + ''
                var elCell = document.querySelector(cellClass)
                var cellPosClass = e.target.classList[1]
                console.log('e.target.classList[1]', cellPosClass)
                var posI = +cellPosClass.split('-')[1]
                var posJ = +cellPosClass.split('-')[2]
                cellRightClicked(e, elCell, posI, posJ, null)
            })
            count = +count
            count++
        }
    }
}
function cellMarked(elCell) {}
function checkGameOver() {}
