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
    addEventListenersForCells()
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
    var elSmily = document.querySelector('.smily')
    elSmily.innerHTML = '<span class="smily-text">Touch me to RESET</span>😄'
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
            strHTML += `\t<td class="td-${currCellId}"><div class="${cellClass} ${visibilityClass}" data-long-press-delay="500" oncontextmenu = "cellRightClicked(event, this,${i} ,${j} , ${currCellId})" onclick="cellLeftClicked(event, this,${i} ,${j} , ${currCellId})">${cellContent}</div></td> \n`
            // strHTML += `\t<td class="cell ' + ${cellClass} + ${visibilityClass} + '" oncontextmenu = "cellRightClicked(event, this,${i} ,${j} , ${currCellId})" onclick="cellLeftClicked(event, this,${i} ,${j} , ${currCellId})">\n`
            // console.log(strHTML)
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
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
                // console.log('e:',e)
                // console.log(e.target.classList[2])
                // console.log(e.target.classList[2].split('-')[1])
                // var cellId = +e.target.classList[2].split('-')[1]
                // console.log('cellId:',cellId)

                console.log('e.target.classList:', e.target.classList)

                var cellClass = '.' + e.target.classList[2] + ''
                // console.log('cellClass:',cellClass)

                var elCell = document.querySelector(cellClass)
                // console.log(elCell)
                // console.log(e.target.classList[1])
                var cellPosClass = e.target.classList[1]
                console.log('e.target.classList[1]',cellPosClass)
                var posI = +cellPosClass.split('-')[1]
                var posJ = +cellPosClass.split('-')[2]
                // console.log('posI,posJ:',posI,posJ)
                cellRightClicked(e, elCell, posI, posJ, null)
                // cellRightClicked(e, elCell, i, j)
            })

            count = +count
            count++
        }
    }
}

function getClassName(location) {
    var cellClass = 'cell cell-' + location.i + '-' + location.j
    return cellClass
}

function cellLeftClicked(event, elCell, i, j, currCellId) {
    // console.log('cell left clicked')
    var cell = gBoard[i][j]
    if (gGame.isOn === false && gActions !== 0) return
    if (cell.isMarked === true || cell.isShown) return
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
        var elSmily = document.querySelector('.smily')
        elSmily.innerHTML = '<span class="smily-text">Touch me to RESET</span>🤯'
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
    // console.log('i:', i)
    // console.log('j:', j)
    //  console.log('currCellId:',currCellId)
}

function renderEndGame(lastMineId) {
    var count = 1
    // console.log(lastMineId)
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
    // console.log('gameOver')
    // console.log('cellId:', cellId)
    gGame.isOn = false
    if (gActions === 0) gActions = 1
    renderEndGame(cellId)
    var cellIdStr = '.td-' + cellId
    // console.log(cellIdStr)

    var elTableCell = document.querySelector(cellIdStr)
    elTableCell.style.backgroundColor = 'red'
    elTableCell.innerHTML = MINE_STRIKE_IMG
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.style.color = 'red'
    elModal.innerText = 'GAME OVER!'
}
function victory() {
    // console.log('victory')
    gGame.isOn = false
    var elBoard = document.querySelector('.board')
    elBoard.style.display = 'none'
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.style.color = 'blue'
    elModal.innerText = 'Great! You WON!'
    var elSmily = document.querySelector('.smily')
    elSmily.innerHTML = '<span class="smily-text">Touch me to RESET</span>🥳'
}

function cellRightClicked(event, elCell, i, j) {
    // console.log('cell right clicked')
    var cell = gBoard[i][j]
    // elCell = document.querySelector('.cell'+i+'-'+j)
    if (gGame.isOn === false && gActions !== 0) return
    if (cell.isShown) return
    if (cell.isMarked === false) {
        var classStr = 'cell-' + i + '-' + j
        var newCellContent = `<img class="flag-img ${classStr} show" src="img/flag.png" />`
        // console.log('classStr:',classStr)
        
        // elCell.classList.add(classStr)
        gFlagsCount++
    } else {
        var newCellContent = cell.isMine ? MINE_IMG : cell.minesAroudCount
        gFlagsCount--
    }
    // elCell.classList.toggle('flag')
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
    // console.log('i:', i)
    // console.log('j:', j)
    // console.log('currCellId:',currCellId)
    setCounters()
}
function renderCell(location, value) {
    var cellSelector = '.cell-' + location.i + '-' + location.j
    var elCell = document.querySelector(cellSelector)
    // console.log(elCell)
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
                // console.log('neg')
                //  console.log(cellContent)
                //  var cellPos = { i: i, j: j }
                //  var cellContent = cell.minesAroudCount
                //  renderCell(cellPos, cellContent)
            }
        }
    }
}

/*!
 * long-press-event - v2.4.4
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!(function (e, t) {
    'use strict'
    var n = null,
        a =
            'PointerEvent' in e ||
            (e.navigator && 'msPointerEnabled' in e.navigator),
        i =
            'ontouchstart' in e ||
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0,
        o = a ? 'pointerdown' : i ? 'touchstart' : 'mousedown',
        r = a ? 'pointerup' : i ? 'touchend' : 'mouseup',
        m = a ? 'pointermove' : i ? 'touchmove' : 'mousemove',
        u = 0,
        s = 0,
        c = 10,
        l = 10
    function v(e) {
        f(),
            (e = (function (e) {
                if (void 0 !== e.changedTouches) return e.changedTouches[0]
                return e
            })(e)),
            this.dispatchEvent(
                new CustomEvent('long-press', {
                    bubbles: !0,
                    cancelable: !0,
                    detail: { clientX: e.clientX, clientY: e.clientY },
                    clientX: e.clientX,
                    clientY: e.clientY,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    screenX: e.screenX,
                    screenY: e.screenY,
                })
            ) ||
                t.addEventListener(
                    'click',
                    function e(n) {
                        t.removeEventListener('click', e, !0),
                            (function (e) {
                                e.stopImmediatePropagation(),
                                    e.preventDefault(),
                                    e.stopPropagation()
                            })(n)
                    },
                    !0
                )
    }
    function d(a) {
        f(a)
        var i = a.target,
            o = parseInt(
                (function (e, n, a) {
                    for (; e && e !== t.documentElement; ) {
                        var i = e.getAttribute(n)
                        if (i) return i
                        e = e.parentNode
                    }
                    return a
                })(i, 'data-long-press-delay', '1500'),
                10
            )
        n = (function (t, n) {
            if (
                !(
                    e.requestAnimationFrame ||
                    e.webkitRequestAnimationFrame ||
                    (e.mozRequestAnimationFrame &&
                        e.mozCancelRequestAnimationFrame) ||
                    e.oRequestAnimationFrame ||
                    e.msRequestAnimationFrame
                )
            )
                return e.setTimeout(t, n)
            var a = new Date().getTime(),
                i = {},
                o = function () {
                    new Date().getTime() - a >= n
                        ? t.call()
                        : (i.value = requestAnimFrame(o))
                }
            return (i.value = requestAnimFrame(o)), i
        })(v.bind(i, a), o)
    }
    function f(t) {
        var a
        ;(a = n) &&
            (e.cancelAnimationFrame
                ? e.cancelAnimationFrame(a.value)
                : e.webkitCancelAnimationFrame
                ? e.webkitCancelAnimationFrame(a.value)
                : e.webkitCancelRequestAnimationFrame
                ? e.webkitCancelRequestAnimationFrame(a.value)
                : e.mozCancelRequestAnimationFrame
                ? e.mozCancelRequestAnimationFrame(a.value)
                : e.oCancelRequestAnimationFrame
                ? e.oCancelRequestAnimationFrame(a.value)
                : e.msCancelRequestAnimationFrame
                ? e.msCancelRequestAnimationFrame(a.value)
                : clearTimeout(a)),
            (n = null)
    }
    'function' != typeof e.CustomEvent &&
        ((e.CustomEvent = function (e, n) {
            n = n || { bubbles: !1, cancelable: !1, detail: void 0 }
            var a = t.createEvent('CustomEvent')
            return a.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), a
        }),
        (e.CustomEvent.prototype = e.Event.prototype)),
        (e.requestAnimFrame =
            e.requestAnimationFrame ||
            e.webkitRequestAnimationFrame ||
            e.mozRequestAnimationFrame ||
            e.oRequestAnimationFrame ||
            e.msRequestAnimationFrame ||
            function (t) {
                e.setTimeout(t, 1e3 / 60)
            }),
        t.addEventListener(r, f, !0),
        t.addEventListener(
            m,
            function (e) {
                var t = Math.abs(u - e.clientX),
                    n = Math.abs(s - e.clientY)
                ;(t >= c || n >= l) && f()
            },
            !0
        ),
        t.addEventListener('wheel', f, !0),
        t.addEventListener('scroll', f, !0),
        t.addEventListener(
            o,
            function (e) {
                ;(u = e.clientX), (s = e.clientY), d(e)
            },
            !0
        )
})(window, document)
