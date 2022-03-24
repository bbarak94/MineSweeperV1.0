'use strict'
function pad(val) {
    var valString = val + ''
    if (valString.length < 2) {
        return '0' + valString
    } else {
        return valString
    }
}

function startTimer() {
    var elMinutes = document.querySelector('.minutes')
    var elSeconds = document.querySelector('.seconds')
    var totalSeconds = gTotalSeconds
    gStartTime = Date.now()
    gIntervalID = setInterval(function () {
        ++totalSeconds
        var timeDiff = Date.now() - gStartTime
        elSeconds.innerText = timeDiff
        var currTime = new Date(timeDiff)
        elSeconds.innerText = pad(currTime.getSeconds())
        elMinutes.innerText = pad(currTime.getMinutes())
    }, 10)
}

function endTimer() {
    clearInterval(gIntervalID)
}
function createOrderedNums(min, max) {
    // returns array from min to max (unique and ordered)
    // includes min and includes max
    // example: createNums(1,16) returns [1,2,3,...,16]
    // Length = max-min+1
    var nums = []
    for (var i = min; i < max + 1; i++) {
        nums.push(i)
    }
    return nums
}
function createShuffledNums(min, max) {
    // returns array from min to max (unique and random)
    // includes min and includes max
    // example: createNums(1,16) returns [2,16,6,..,1,..,3] (length:16)
    var nums = []
    for (var i = min; i < max + 1; i++) {
        nums.push(i)
    }
    return shuffle(nums)
}
function shuffle(items) {
    var randIdx, keep
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1)

        keep = items[i]
        items[i] = items[randIdx]
        items[randIdx] = keep
    }
    return items
}
function drawNum(arr) {
    var idx = getRandomInt(0, arr.length - 1)
    // var num = gNums2[idx]
    // gNums2.splice(idx, 1)
    // THE SAME
    var num = arr.splice(idx, 1)[0]
    return num
}
function getRandomInt(min, max) {
    // getRandomInt(1,10) returns a number
    // includes min and includes max
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// function copyMat(mat) {
//     var newMat = []
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = []
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j]
//         }
//     }
//     return newMat
// }

// function createMat(ROWS, COLS) {
//     var mat = []
//     for (var i = 0; i < ROWS; i++) {
//         var row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }
// function getRandomColor() {
//     var letters = '0123456789ABCDEF'
//     var color = '#'
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)]
//     }
//     return color
// }
// function createTable(gNums) {
//     // returns squared mat of gNums (gNums must be square Number's length arr)

//     var board = []
//     var sidesCount = gNums.length ** 0.5
//     for (var i = 0; i < sidesCount; i++) {
//         board.push([])
//         for (var j = 0; j < sidesCount; j++) {
//             var cell = gNums[j + i * sidesCount]
//             board[i].push(cell)
//         }
//     }
//     return board
// }

// function openVictoryModal() {
//     // VictoryModal:
//     var elTableContainer = document.querySelector('.board-container')
//     elTableContainer.style.display = 'none'
//     var elModal = document.querySelector('.modal')
//     elModal.style.display = 'initial'
//     var elModalText = document.querySelector('.modal-text')
//     elModalText.innerText = 'Game Over - You Won'
//     elModalText.style.color = 'blue'
// }

// function openLossModal() {
//     // LossModal:
//     var elTableContainer = document.querySelector('.board-container')
//     elTableContainer.style.display = 'none'
//     var elModal = document.querySelector('.modal')
//     elModal.style.display = 'initial'
//     var elModalText = document.querySelector('.modal-text')
//     elModalText.innerText = 'Game Over - You Lost'
//     elModalText.style.color = 'red'
// }

// function closeVictoryModal() {
//     var elTableContainer = document.querySelector('.board-container')
//     elTableContainer.style.display = 'initial'
//     var elModal = document.querySelector('.modal')
//     elModal.style.display = 'none'
// }

// function closeLossModal() {
//     var elTableContainer = document.querySelector('.board-container')
//     elTableContainer.style.display = 'initial'
//     var elModal = document.querySelector('.modal')
//     elModal.style.display = 'none'
// }

// timer functions:
// function startTimer() {
//     // put in Global:
//     // var gIntervalID
//     // var gStartTime = 0

//     // put in init:
//     // gTotalSeconds = 0
//     // gStartTime = 0
//     // clearInterval(gIntervalID)
//     // document.querySelector('.minutes').innerHTML = pad(0)
//     // document.querySelector('.seconds').innerHTML = pad(parseInt(0))
//     var elMinutes = document.querySelector('.minutes')
//     var elSeconds = document.querySelector('.seconds')
//     // var totalSeconds = gTotalSeconds;
//     gStartTime = Date.now()
//     gIntervalID = setInterval(function () {
//         // ++totalSeconds;
//         var timeDiff = Date.now() - gStartTime
//         elSeconds.innerText = timeDiff
//         // var currTime = new Date(timeDiff)
//         // elSeconds.innerText = pad(currTime.getSeconds());
//         // elMinutes.innerText = pad(currTime.getMinutes());
//     }, 10)
// }
// function endTimer() {
//     clearInterval(gIntervalID)
// }
// function pad(val) {
//     var valString = val + ''
//     if (valString.length < 2) {
//         return '0' + valString
//     } else {
//         return valString
//     }
// }
///////////////////////////////////////////////////////////////////////////////////
// function printMat(mat, selector) {
//     var strHTML = '<table border="0"><tbody>'
//     for (var i = 0; i < mat.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < mat[0].length; j++) {
//             var cell = mat[i][j]
//             var className = 'cell cell-' + i + '-' + j
//             strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>'
//     var elContainer = document.querySelector(selector)
//     elContainer.innerHTML = strHTML
// }
// location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }
// function getRandomIntInclusive(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }

// clock:
// function pad(val) {
//    var valString = val + '';
//    if (valString.length < 2) {
//      return '0' + valString;
//    } else {
//      return valString;
//    }
//  }
// function startTimer() {
//    var elMinutes = document.querySelector('.minutes');
//    var elSeconds = document.querySelector('.seconds');
//    // var totalSeconds = gTotalSeconds;
//    gStartTime = Date.now()
//    gIntervalID = setInterval(function () {
//      // ++totalSeconds;
//      var timeDiff = Date.now() - gStartTime
//      elSeconds.innerText = timeDiff;
//      // var currTime = new Date(timeDiff)
//      // elSeconds.innerText = pad(currTime.getSeconds());
//      // elMinutes.innerText = pad(currTime.getMinutes());
//    }, 10);
//  }

//  function endTimer() {
//    clearInterval(gIntervalID);
//  }

// function getEmptyCells(mat, empty) {
//    var emptyCells = []
//    for (var i = 0; i < mat.length; i++) {
//      for (var j = 0; j < mat.length; j++) {
//        if (mat[i][j] === empty) emptyCells.push({ i, j })
//      }
//    }

//    return emptyCells
//  }

// 'use strict'

// function printMat(mat, selector) {
//   var strHTML = '<table border="0"><tbody>'
//   for (var i = 0; i < mat.length; i++) {
//     strHTML += '<tr>'
//     for (var j = 0; j < mat[0].length; j++) {
//       var cell = mat[i][j]
//       var className = 'cell cell-' + i + '-' + j
//       strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
//     }
//     strHTML += '</tr>'
//   }
//   strHTML += '</tbody></table>'
//   var elContainer = document.querySelector(selector)
//   elContainer.innerHTML = strHTML
// }

// // location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//   // Select the elCell and set the value
//   var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//   if (value.includes(GHOST)) {
//     for (var ghost of gGhosts) {
//       if (ghost.location.i === location.i && ghost.location.j === location.j) {
//         elCell.style.color = ghost.color
//         break
//       }
//     }
//   } else {
//     elCell.style.color = 'white'
//   }

//   if(value !== PACMAN) elCell.style.transform = 'rotate(0)'
//   else if(value === PACMAN) elCell.style.transform = `rotate(${gPacman.direction})`

//   elCell.innerHTML = value
// }

// function getRandomIntInclusive(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

// function copyMat(mat) {
//    var newMat = [];
//    for (var i = 0; i < mat.length; i++) {
//        newMat[i] = [];
//        for (var j = 0; j < mat[0].length; j++) {
//            newMat[i][j] = mat[i][j];
//        }
//    }
//    return newMat;
// }

// 'use strict'

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min;
// }

// function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF'
//     var color = '#'
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)]
//     }
//     return color
// }

// function shuffle(items) {
//     var randIdx, keep;
//     for (var i = items.length - 1; i > 0; i--) {
//         randIdx = getRandomInt(0, items.length);
//         keep = items[i];
//         items[i] = items[randIdx];
//         items[randIdx] = keep;
//     }
//     return items;
// }

// function createMat(ROWS, COLS) {
//     var mat = []
//     for (var i = 0; i < ROWS; i++) {
//         var row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }

// function copyMat(mat) {
//     var newMat = []
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = []
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j]
//         }
//     }
//     return newMat
// }

// function findEmptyCells() {
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard.length; j++) {
//             var cell = gBoard[i][j]
//             if (!cell) return { i, j }
//         }
//     }
//     return null
// }

// function getNeighbors(mat, idxI, idxJ) {
//     var neightbors = []
//     for (var i = idxI - 1; i <= idxI + 1; i++) {
//         if (i < 0 || i > mat.length - 1) continue

//         for (var j = idxJ - 1; j <= idxJ + 1; j++) {
//             if (i === idxI && j === idxJ) continue
//             if (j < 0 || j > mat[i].length - 1) continue

//             neightbors.push(mat[i][j])
//         }
//     }

//     return neightbors
// }

// function printPrimaryDiagonal(squareMat) {
//     for (var d = 0; d < squareMat.length; d++) {
//         var item = squareMat[d][d];
//         console.log(item);
//     }
// }

// function printSecondaryDiagonal(squareMat) {
//     for (var d = 0; d < squareMat.length; d++) {
//         var item = squareMat[d][squareMat.length - 1 - d];
//         console.log(item);
//     }
// }

// function renderMat(mat, selector) {
//     var strHTML = '<table border="0"><tbody>';
//     for (var i = 0; i < mat.length; i++) {
//         strHTML += '<tr>';
//         for (var j = 0; j < mat[0].length; j++) {
//             var cell = mat[i][j];
//             var className = 'cell cell-' + i + '-' + j;
//             strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>';
//     var elContainer = document.querySelector(selector);
//     elContainer.innerHTML = strHTML;
// }

// function renderCell(location, value) {
//     var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
//     elCell.innerHTML = value;
//     return elCell;
// }

// //** TIMER */

// function pad(val) {
//     let valString = val + ''
//     if (valString.length < 2) return '0' + valString
//     return valString
// }

// gStartTime = Date.now()
// function timer() {
//     //NOTICE: WE NEED GLOBAL START TIME - gStartTime
//     var timeDiff = Date.now() - gStartTime
//     currTime = new Date(timeDiff)
//     var timeStr = pad(currTime.getMinutes())
//     timeStr += ':' + pad(currTime.getSeconds())
//     return timeStr
// }
