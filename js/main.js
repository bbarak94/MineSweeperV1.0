'use strict'
console.log('main.js connected')
window.addEventListener('contextmenu', (e) => e.preventDefault())

var FLAG_IMG = '<img class="flag-img" src="img/flag.png" />'
var MINE_IMG = '<img class="mine-img" src="img/mine.png" />'
var MINE_STRIKE_IMG = '<img class="mine-img" src="img/minestrike.png" />'

var gBoard
var gLevel = {
    sizeRows: 8,
    sizeCols: 8,
    mines: 0,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gCellId = 1
var gActions = 0

var gCellCount = 0
var gFlagsCount = 0

function initGame() {
    resetGlobals()
    gGame.sizeRows = gGame.sizeRows > 16 ? gGame.sizeRows / 2 : gGame.sizeRows
    gBoard = buildBoard(gLevel.sizeRows, gLevel.sizeCols)
    setMinesNegsCount()
    renderBoard()
    setCounters()
}

function resetGlobals() {
    gCellId = 1
    gActions = 0
    gCellCount = 0
    gFlagsCount = 0
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    gLevel.mines = 0
    setCounters()
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    //  gboard = []
}

function levelSelect(v) {
    //  console.log(v.target.id)
    var levelName = v.target.id
    if (!v.target.value) {
        var level = 8
    } else {
        var level = v.target.value
    }

    localStorage.setItem('myLevel', level)
    gLevel.sizeCols = level
    gLevel.sizeRows = level > 16 ? level / 2 : level
    var elChoice = document.querySelector('.choice')
    elChoice.innerText =
        'Level Choice: ' +
        levelName +
        ' ' +
        gLevel.sizeRows +
        '*' +
        gLevel.sizeCols
    initGame()
}

function setCounters() {
    var counters = document.querySelectorAll('.counters>h2')
    counters[0].innerText = 'Mines count: ' + gLevel.mines
    counters[1].innerText = 'Actions count: ' + gActions
    counters[2].innerText = 'Cells remaining to win: ' + gCellCount
    counters[3].innerText = 'Flags Count: ' + gFlagsCount
}
function buildBoard(Rows, Cols = Rows) {
    var board = []
    for (var i = 0; i < Rows; i++) {
        var row = []
        for (var j = 0; j < Cols; j++) {
            var cell = {
                cellId: gCellId++,
                pos: { i: i, j: j },
                minesAroudCount: 0,
                isShown: false,
                isMine: mineDeploy(),
                isMarked: false,
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board
}

// set mines randomly 20% chance to get mine:
function mineDeploy() {
    var randomNum = Math.random()
    var isMine = randomNum <= 0.2 ? true : false
    if (isMine) {
        gLevel.mines++
    } else {
        gCellCount++
    }
    return isMine
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var neighborsCount = countNeighbors(i, j)
            gBoard[i][j].minesAroudCount = neighborsCount
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
                cellClass += 'clear ' + 'negs-' + currCell.minesAroudCount + ' '
                cellContent = currCell.minesAroudCount + ''
            }
            if (currCell.isMarked === true) {
                cellClass += 'flag' + ' '
                cellContent = FLAG_IMG
            }

            // console.log('cellClass:',cellClass)
            var visibilityClass = currCell.isShown ? 'show ' : 'hide '
            strHTML += `\t<td class="td-${currCellId}"><div class="${cellClass} ${visibilityClass}" onLongTouch = "cellRightClicked(event, this,${i} ,${j} , ${currCellId})" oncontextmenu = "cellRightClicked(event, this,${i} ,${j} , ${currCellId})" onclick="cellLeftClicked(event, this,${i} ,${j} , ${currCellId})">${cellContent}</div></td> \n`
            // strHTML += `\t<td class="cell ' + ${cellClass} + ${visibilityClass} + '" oncontextmenu = "cellRightClicked(event, this,${i} ,${j} , ${currCellId})" onclick="cellLeftClicked(event, this,${i} ,${j} , ${currCellId})">\n`
            // console.log(strHTML)
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
    console.log('cell left clicked')
    var cell = gBoard[i][j]
    if (gGame.isOn === false && gActions !== 0) return
    if (cell.isMarked === true || cell.isShown) return
    console.log('i,j:', i, j)
    var cellClasses = elCell.classList + ''
    console.log('cellClasses:', cellClasses)
    console.log('cell.isMine:', cell.isMine)
    console.log('cell.isShown:', cell.isShown)
    if (gActions === 0 && cell.isMine === false) {
        cell.isShown = true
        elCell.classList.add('show')
        elCell.classList.remove('hide')
        gActions++
        expandShown(elCell, i, j)
        setCounters()
        gGame.isOn = true
        return
    }
    if (!cell.isShown && !cell.isMine) {
        cell.isShown = true
        elCell.classList.toggle('show')
        elCell.classList.toggle('hide')
        gActions++
    }
    if (cell.isMine === true) {
        cell.isShown = true
        elCell.classList.toggle('show')
        elCell.classList.toggle('hide')
        elCell.style.backgroundColor = 'red'
        gameOver(cell.cellId)
    }
    setCounters()
    if (gCellCount === gActions) {
        victory()
    }
    // console.log('event:',event)
    //  var cellClasses = elCell.classList + ''
    //  console.log('cellClasses:', cellClasses)

    //  console.log(elCell)
    //  var elCellClicked = document.querySelectorAll('.cell')
    //  console.log(elCellClicked[0])
    // console.log('event:',event)
    console.log('i:', i)
    console.log('j:', j)
    //  console.log('currCellId:',currCellId)
}

function renderEndGame(lastMineId) {
    var count = 1
    console.log(lastMineId)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cellIdStr = '.id-' + count
            var elCell = document.querySelector(cellIdStr)
            var tdCellIdStr = '.td-' + count
            var elTableCell = document.querySelector(tdCellIdStr)
            if (gBoard[i][j].isMarked) {
                elCell.classList.add('show')
                elCell.classList.remove('hide')
                elTableCell.style.backgroundColor = 'blue'
            } else if (gBoard[i][j].isMine) {
                elCell.classList.add('show')
                elCell.classList.remove('hide')
                elTableCell.style.backgroundColor = 'red'
            } else {
                elTableCell.style.backgroundColor = 'green'
            }
            count++
        }
    }
}

function gameOver(cellId) {
    console.log('gameOver')
    console.log('cellId:', cellId)
    gGame.isOn = false
    if (gActions === 0) gActions = 1
    renderEndGame(cellId)
    var cellIdStr = '.td-' + cellId
    console.log(cellIdStr)
    var elTableCell = document.querySelector(cellIdStr)
    elTableCell.style.backgroundColor = 'red'
    elTableCell.innerHTML = MINE_STRIKE_IMG
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.style.color = 'red'
    elModal.innerText = 'GAME OVER!'
}
function victory() {
    console.log('victory')
    gGame.isOn = false
    var elBoard = document.querySelector('.board')
    elBoard.style.display = 'none'
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.style.color = 'blue'
    elModal.innerText = 'Great! You WON!'
}

function cellRightClicked(event, elCell, i, j, currCellId) {
    console.log('cell right clicked')
    var cell = gBoard[i][j]
    if (gGame.isOn === false && gActions !== 0) return
    if (cell.isShown) return
    if (cell.isMarked === false) {
        var newCellContent = FLAG_IMG
        gFlagsCount++
    } else {
        var newCellContent = cell.isMine ? MINE_IMG : cell.minesAroudCount
        gFlagsCount--
    }
    elCell.classList.toggle('flag')
    elCell.classList.toggle('show')
    elCell.classList.toggle('hide')
    cell.isMarked = !cell.isMarked
    var cellPos = { i: i, j: j }
    renderCell(cellPos, newCellContent)
    //  console.log(cellPos, newCellContent)

    //  if(!gBoard[i][j].isShown)
    // console.log('event:',event)
    // console.log(elCell)
    //  var elCellClicked = document.querySelectorAll('.cell')
    //  console.log(elCellClicked[0])
    // console.log('event:',event)
    console.log('i:', i)
    console.log('j:', j)
    // console.log('currCellId:',currCellId)
    setCounters()
}
function renderCell(location, value) {
    var cellSelector = '.cell-' + location.i + '-' + location.j
    var elCell = document.querySelector(cellSelector)
    console.log(elCell)
    //   console.log(value)
    elCell.innerHTML = value
}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine === false) {
                var cell = gBoard[i][j]
                //  var elCell = document.querySelector()
                cell.isShown = true
                var cellSelector = '.cell-' + i + '-' + j
                var elCell = document.querySelector(cellSelector)
                elCell.classList.add('show')
                elCell.classList.remove('hide')
                gActions++
                console.log('neg')
                //  console.log(cellContent)
                //  var cellPos = { i: i, j: j }
                //  var cellContent = cell.minesAroudCount
                //  renderCell(cellPos, cellContent)
            }
        }
    }
}
