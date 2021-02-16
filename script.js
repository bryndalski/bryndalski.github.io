'use strict'
const pillsColors = [{
        color: "red",
        imgSource: `url('./images/redPill.png')`,
        aloneImagine: `url('./images/redDot.png')`
    },
    {
        color: "blue",
        imgSource: `url('./images/bluePill.png')`,
        aloneImagine: `url('./images/blueDot.png')`
    },
    {
        color: "yellow",
        imgSource: `url('./images/yellowPill.png')`,
        aloneImagine: `url('./images/yellowDot.png')`
    },
]
const virusColor = [{
    color: "red",
    imagine: `url('./images/redVirus.gif')`,
    dead: `url('./images/redDestroy.gif')`,
    deadVirus: `url('./images/redVirusDestroy.gif')`

}, {
    color: "blue",
    imagine: `url('./images/blueVirus.gif')`,
    dead: `url('./images/blueDestroy.gif')`,
    deadVirus: `url('./images/blueVirusDestroy.gif')`

}, {
    color: "yellow",
    imagine: `url('./images/yellowVirus.gif')`,
    dead: `url('./images/yellowDestroy.gif')`,
    deadVirus: `url('./images/yellowVirusDestroy.gif')`


}]
let pillFallInterval;
const rotationAngles = ['rotate(0deg)', 'rotate(-180deg)', 'rotate(-90deg)', 'rotate(90deg)']
const game = {
    wirusNumbers: {

        blue: 0,
        yellow: 0,
        red: 0,
    },
    gameArray: [],
    points: 0,
    level: 1,
    pillInfo: {},
    rotationAngle: 0,
    dropArray: [],
    pillSegmentLeft: {},
    pillSegmentRight: {},
    topScpre: [],
    virusNumber: "",
    repeate: null,
    createGame: () => { // tworzy całą plansze z wyj. siatki ( dane bierze sobie z obiektu gameStartClass)
        game.gameArray = []
        game.dropArray = []
        game.pillInfo = {}
        Object.keys(gameStartClass).forEach(key => { //exctract object keys as [key1,key2,key3] then executes for each of them
            let elementContainer = document.createElement('div')
            elementContainer.classList.add(gameStartClass[key].container)
            Object.keys(gameStartClass[key]).forEach(insideKey => {
                if (insideKey !== 'container') {
                    let child = document.createElement('div')
                    child.classList.add(gameStartClass[key][insideKey])
                    elementContainer.appendChild(child)
                }
            })
            document.body.querySelector('.screen').appendChild(elementContainer)
        })
    },
    createWeb: () => {
        for (let row = 0; row < 16; row++) {
            game.gameArray[row] = []
            for (let column = 0; column < 8; column++) {
                game.gameArray[row][column] = {
                    squereId: parseInt(row + "" + column),
                    squereArrayCoords: {
                        row: row,
                        column: column
                    },
                    contains: {
                        possibleRotation: true,
                        possibleStopPoint: true,
                    },
                }
                let webDiv = document.createElement('div')
                webDiv.id = parseInt(row + "" + column)
                document.querySelector('.netName').appendChild(webDiv)
            }
        }
    },
    createNumberFrame: (parentName, idPrefix, digitNumber, nuller) => {
        for (let i = 0; i < digitNumber; i++) {
            let digit = document.createElement('img')
            digit.id = idPrefix + i
            if (nuller)
                digit.src = './images/cyfry/0.png'
            document.querySelector(`.${parentName}`).appendChild(digit)
        }

    },
    //* Zabawa z tabletkami 
    createPill: () => {
        game.rotationAngle = 0;
        game.pillInfo = {}
        //IMPUT MARIO HERE 
        game.pillInfo = {
            leftSegment: {
                ...game.pillSegmentLeft,
                rotationAngle: rotationAngles[0]
            },
            rightSegment: {
                ...game.pillSegmentRight,
                rotationAngle: rotationAngles[1]
            },
            lastPositions: {
                left: 3,
                right: 4
            },
            unTransformedPosition: {
                left: 3,
            },
        }
    },
    pillPosition: (leftPill, rightPill) => {
        //clear last images 
        document.getElementById(game.pillInfo.lastPositions.left).style.backgroundImage = `url('')`
        document.getElementById(game.pillInfo.lastPositions.right).style.backgroundImage = `url('')`
        //new pills background
        document.getElementById(leftPill).style.backgroundImage = game.pillInfo.leftSegment.imgSource
        document.getElementById(rightPill).style.backgroundImage = game.pillInfo.rightSegment.imgSource
        //new pills rotation
        document.getElementById(leftPill).style.transform = game.pillInfo.leftSegment.rotationAngle
        document.getElementById(rightPill).style.transform = game.pillInfo.rightSegment.rotationAngle
        //arrar change
        game.pillInfo.lastPositions = {
            left: leftPill,
            right: rightPill
        }
    },
    pillFlag(e) {
        clearInterval(game.repeate)
        document.addEventListener('keydown', game.pillMove)
        game.repeate = null
    },
    //* Pozycjownowanie tabletek
    pillMove: (e) => {
        document.removeEventListener('keydown', game.pillMove) // TODO wywal obracanie za interwał 
        // document.removeEventListener('keyup', game.pillFlag)
        game.repeate = setInterval(() => {
            //? Kod łapie mi 1 char i działa ok 1 klik i ruch pytanie dlaczego interwał nie działa tak smooth jak chciałem
            switch (e.keyCode) {
                case 37:
                case 65:
                    game.pillMoveExecutoner(0)
                    break;
                case 39:
                case 68:
                    game.pillMoveExecutoner(1)
                    break;
                case 38:
                case 87:
                    game.pillMoveExecutoner(2)
                    break
                case 16:
                    game.pillMoveExecutoner(3)
                    break
                case 40:
                case 83:
                    clearInterval(game.repeate)
                    game.pillMoveExecutoner(4)
                    break
            }
        }, 60, e)
    },
    pillMoveExecutoner(kliker) {
        switch (kliker) {
            case 0: //left
                try {
                    if ((game.pillInfo.lastPositions.left - 1) % 10 >= 0 && (game.pillInfo.lastPositions.left - 1) % 10 <= 7 && game.gameArray[Math.floor((game.pillInfo.lastPositions.left - 1) / 10)][(game.pillInfo.lastPositions.left - 1) % 10].contains.possibleRotation && game.gameArray[Math.floor((game.pillInfo.lastPositions.right - 1) / 10)][(game.pillInfo.lastPositions.right - 1) % 10].contains.possibleRotation) {
                        game.pillPosition((game.pillInfo.lastPositions.left - 1), (game.pillInfo.lastPositions.right - 1))
                        game.pillInfo.unTransformedPosition.left -= 1
                    }
                } catch (err) {}
                break
            case 1: //right
                try {
                    if ((game.pillInfo.lastPositions.right + 1) % 10 <= 7 && game.gameArray[Math.floor((game.pillInfo.lastPositions.left + 1) / 10)][(game.pillInfo.lastPositions.left + 1) % 10].contains.possibleRotation && game.gameArray[Math.floor((game.pillInfo.lastPositions.right + 1) / 10)][(game.pillInfo.lastPositions.right + 1) % 10].contains.possibleRotation) {
                        game.pillPosition((game.pillInfo.lastPositions.left + 1), (game.pillInfo.lastPositions.right + 1))
                        game.pillInfo.unTransformedPosition.left += 1
                    }
                } catch (err) {}
                break
            case 2: //rotate left
                if (
                    (game.pillInfo.lastPositions.left % 10) === 7 &&
                    (game.pillInfo.lastPositions.right % 10) === 7
                )
                    game.pillMoveExecutoner(0)
                //? normalna część nie rusz 
                game.rotationAngle++
                if (game.rotationAngle === 4)
                    game.rotationAngle = 0
                if (!game.pillRotate())
                    game.rotationAngle--
                break
            case 3: //rotate right
                if (
                    (game.pillInfo.lastPositions.left % 10) === 7 &&
                    (game.pillInfo.lastPositions.right % 10) === 7
                )
                    game.pillMoveExecutoner(0)
                game.rotationAngle--
                if (game.rotationAngle === -1)
                    game.rotationAngle = 3
                if (!game.pillRotate())
                    game.rotationAngle++
                break
            case 4: // execute fall 33
                clearInterval(pillFallInterval)
                clearInterval(game.repeate)
                game.repeate = null
                pillFallInterval = setInterval(game.pillFall, 10)
                document.removeEventListener('keydown', game.pillMove)
                document.removeEventListener('keyup', game.pillFlag)
                //TODO wyłączanie ruchu
                break
        }
    },
    pillFall: () => {
        try {
            if ((game.pillInfo.lastPositions.right + 10) / 10 < 16 && (game.pillInfo.lastPositions.left + 10) / 10 < 16 && game.gameArray[Math.floor((game.pillInfo.lastPositions.left + 10) / 10)][(game.pillInfo.lastPositions.left + 10) % 10].contains.possibleStopPoint && game.gameArray[Math.floor((game.pillInfo.lastPositions.right + 10) / 10)][(game.pillInfo.lastPositions.right + 10) % 10].contains.possibleStopPoint) {
                game.pillPosition((game.pillInfo.lastPositions.left + 10), (game.pillInfo.lastPositions.right + 10))
                game.pillInfo.unTransformedPosition.left += 10
            } else {
                game.setPillArray()
                clearInterval(pillFallInterval)
                game.fallCheck(true)
            }
        } catch (err) {
            game.setPillArray()
            clearInterval(pillFallInterval)
            game.fallCheck(true)
        }
    },
    pillRotate: () => {
        switch (game.rotationAngle) {
            case 0: //Wyjściowa pill : <=||=>
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.unTransformedPosition.left) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.lastPositions.left + 1) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[0]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[1]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left), (game.pillInfo.unTransformedPosition.left + 1))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
            case 1: //Do góry pill : v=||=^
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.unTransformedPosition.left) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left - 10) / 10)][(game.pillInfo.lastPositions.left) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[2]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[3]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left), (game.pillInfo.unTransformedPosition.left - 10))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
            case 2: //pill zamieniony stronami == > lewa||prawa >>>> prawa|lewa
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.unTransformedPosition.left + 1) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.lastPositions.left) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[1]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[0]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left + 1), (game.pillInfo.unTransformedPosition.left))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
            case 3: //Do góry pill : ^=||=v
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left - 10) / 10)][(game.pillInfo.unTransformedPosition.left) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.lastPositions.left) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[3]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[2]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left - 10), (game.pillInfo.unTransformedPosition.left))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
        }
    },
    //* moment końca operowania na pigułce 
    setPillArray: () => {
        clearInterval(game.repeate)
        document.removeEventListener('keydown', game.pillMove) //!!!! zostaw bo inaczej będzie śmmieszny bug :)
        document.removeEventListener('keyup', game.pillFlag)
        game.gameArray[Math.floor(game.pillInfo.lastPositions.left / 10)][game.pillInfo.lastPositions.left % 10].contains = {
            type: "pill",
            color: game.pillInfo.leftSegment.color,
            rotationAngle: game.pillInfo.leftSegment.rotationAngle,
            points: 0,
            possibleRotation: false,
            possibleStopPoint: false
        }
        game.gameArray[Math.floor(game.pillInfo.lastPositions.right / 10)][game.pillInfo.lastPositions.right % 10].contains = {
            type: "pill",
            color: game.pillInfo.rightSegment.color,
            rotationAngle: game.pillInfo.rightSegment.rotationAngle,
            points: 0,
            possibleRotation: false,
            possibleStopPoint: false
        }
        game.refreshNet() //!! zabezpieczenie odświeża po umieszczeniu tabletki w razie gdy animacja nie nadąża nad tablicą

    },
    //*zbijania
    fallCheck: (shouldNewPillBeCreated) => {
        let killArray = [],
            lastColor = "",
            dropCounter = 1,
            lastRow = 0,
            columnCounter = 0
        //*poziome 
        game.gameArray.forEach((littleArray, row) => {
            littleArray.forEach((index) => { // check for horizontal drops  
                if (lastRow !== row) {
                    if (dropCounter >= 4)
                        game.dropArray = game.dropArray.concat(killArray)
                    killArray = []
                    dropCounter = 1
                    lastRow = row
                }
                if (index.contains.color !== undefined)
                    if (index.contains.color === "" || index.contains.color !== lastColor) {
                        lastColor = index.contains.color
                        if (dropCounter >= 4) {
                            dropCounter = 1
                            game.dropArray = game.dropArray.concat(killArray)
                            killArray = []
                        } else {
                            dropCounter = 1
                            killArray = []
                        }
                        killArray.push(index)

                    }
                else {
                    dropCounter++
                    killArray.push(index)
                } else {
                    lastColor = ""
                    if (dropCounter >= 4) {
                        dropCounter = 1
                        game.dropArray = game.dropArray.concat(killArray)
                        killArray = []
                    }
                }
            })
        })
        //* działa zbijanie w pionie 
        // vertical check
        game.gameArray[0].forEach((useless, counter) => {
            game.gameArray.forEach((index, miniCountert) => {
                if (lastRow !== counter) {
                    if (dropCounter >= 4)
                        game.dropArray = game.dropArray.concat(killArray)
                    killArray = []
                    dropCounter = 1
                    lastRow = counter
                    lastColor = ""
                }
                if (index[counter].contains.color !== undefined) {
                    if (lastColor === "" || lastColor !== index[counter].contains.color) {
                        lastColor = index[counter].contains.color
                        if (dropCounter >= 4) {
                            dropCounter = 1
                            game.dropArray = game.dropArray.concat(killArray)
                            killArray = []
                        } else {
                            dropCounter = 1
                            killArray = []
                        }
                        killArray.push(index[counter])
                    } else {
                        dropCounter++
                        killArray.push(index[counter])
                    }
                } else {
                    lastColor = ""
                    if (dropCounter >= 4) {
                        dropCounter = 1
                        game.dropArray = game.dropArray.concat(killArray)
                        killArray = []
                    } else {
                        dropCounter = 1
                        killArray = []
                    }
                }
                if (miniCountert === 15 && counter === 7)
                    if (dropCounter >= 4) {
                        dropCounter = 1
                        game.dropArray = game.dropArray.concat(killArray)
                        killArray = []
                    } else {
                        dropCounter = 1
                        killArray = []
                    }

            })
        })
        if (game.dropArray.length !== 0)
            game.killPill(shouldNewPillBeCreated)
        else if (shouldNewPillBeCreated) {
            mario.throwPill({
                "left": game.pillSegmentLeft,
                'right': game.pillSegmentRight
            })
        }
    },
    killPill: (shouldDrop) => {
        game.dropArray = Array.from(new Set(game.dropArray)) // set zawieta tylko unikalne wartości => eliminuje powtórki przy skosach
        let stop = false
        game.dropArray.forEach((index) => {
            if (index.contains.type === "virus") {
                game.points += 100
                game.setNumber('nameScore', game.points)
                game.virusNumber--
                game.setNumber('virusNumber', game.virusNumber)
                //* zbicia wirusów 
                game.wirusNumbers[index.contains.color]--
                console.log(Object.values(game.wirusNumbers))

                lupa.destroyVirus(index.contains.color)
                stop = true
            }
        })
        if (stop) setTimeout(lupa.startCarusell, 2000)
        game.dropArray.forEach((element) => {
            document.getElementById(element.squereId).style.backgroundImage = ``
            document.getElementById(element.squereId).style.transform = ``
            switch (element.contains.color) {
                case "yellow":
                    document.getElementById(element.squereId).style.backgroundImage = (element.contains.type == "virus") ? virusColor[2].deadVirus : virusColor[2].dead
                    break
                case "red":
                    document.getElementById(element.squereId).style.backgroundImage = (element.contains.type == "virus") ? virusColor[0].deadVirus : virusColor[0].dead
                    break
                case "blue":
                    document.getElementById(element.squereId).style.backgroundImage = (element.contains.type == "virus") ? virusColor[1].deadVirus : virusColor[1].dead
                    break
            }
            if (!element.contains.shouldFall)
                switch (element.contains.rotationAngle) {
                    case 'rotate(0deg)': //+ index
                        game.gameArray[element.squereArrayCoords.row][element.squereArrayCoords.column + 1].contains.shouldFall = true
                        break
                    case 'rotate(90deg)': // + rząd 
                        game.gameArray[element.squereArrayCoords.row + 1][element.squereArrayCoords.column].contains.shouldFall = true
                        break
                    case 'rotate(-90deg)': // - rząd 
                        game.gameArray[element.squereArrayCoords.row - 1][element.squereArrayCoords.column].contains.shouldFall = true
                        break
                    case 'rotate(-180deg)': // - index
                        game.gameArray[element.squereArrayCoords.row][element.squereArrayCoords.column - 1].contains.shouldFall = true
                        break
                }
            delete game.gameArray[element.squereArrayCoords.row][element.squereArrayCoords.column]['contains']
            game.gameArray[element.squereArrayCoords.row][element.squereArrayCoords.column]["contains"] = {
                possibleRotation: true,
                possibleStopPoint: true
            }
        })
        //pora na gifa
        game.dropArray = []
        setTimeout(() => {
            if (shouldDrop)
                game.dropIt()
        }, 1000)


    },
    throwPill: () => {
        mario.throwPill({
            "left": game.pillSegmentLeft,
            'right': game.pillSegmentRight
        })
        if (game.gameArray[0][3].contains.possibleStopPoint && game.gameArray[0][4].contains.possibleStopPoint) {
            game.createPill()
            game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))]
            game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))]
        } else {
            document.removeEventListener('keydown', game.pillMove)
            document.removeEventListener('keyup', game.pillFlag)
            clearInterval(pillFallInterval)
            mario.looser()
        }
    },
    //* wiruski 
    createVirusMap: () => {
        game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))] //finds next pill colors
        game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))] //finds next pill colors 
        let intervalCounter = 0
        let found = true
        for (let i = 0; i < gameLevelsSettings[game.level].virusNumber; i++) {
            intervalCounter++
            if (intervalCounter === 3)
                intervalCounter = 0
            found = true

            while (found) {
                let X = Math.floor(Math.random() * 11) + 5
                let Y = Math.floor(Math.random() * 8)
                if (Object.keys(game.gameArray[X][Y].contains).length == 2) {
                    let colorCounter = 1
                    found = false
                    game.wirusNumbers[virusColor[intervalCounter].color]++
                    game.gameArray[X][Y].contains = {
                        possibleRotation: false,
                        possibleStopPoint: false,
                        type: "virus",
                        color: virusColor[intervalCounter].color,
                        imagine: virusColor[intervalCounter].imagine
                    }

                }
            }


            if (i === gameLevelsSettings[game.level].virusNumber - 1) {
                console.log(game.wirusNumbers)
                game.refreshNet()
                game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))]
                game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))]
                game.createPill()
                mario.throwPill({
                    "left": game.pillSegmentLeft,
                    'right': game.pillSegmentRight
                })
            }
        }
    },
    //*opadanie + refresh planszy 
    refreshNet: () => {
        for (let i = 0; i < game.gameArray.length; i++) {
            for (let j = 0; j < game.gameArray[i].length; j++) {
                try {
                    if (game.gameArray[i][j].contains.type === "virus")
                        switch (game.gameArray[i][j].contains.color) {
                            case "red":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = virusColor[0].imagine
                                break
                            case "blue":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = virusColor[1].imagine
                                break
                            case "yellow":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = virusColor[2].imagine
                                break
                        }
                    else if (game.gameArray[i][j].contains.shouldFall) {
                        switch (game.gameArray[i][j].contains.color) {
                            case "red":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = pillsColors[0].aloneImagine
                                break
                            case "blue":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = pillsColors[1].aloneImagine
                                break
                            case "yellow":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = pillsColors[2].aloneImagine
                                break
                        }
                    } else if (game.gameArray[i][j].contains.type === "pill") {
                        switch (game.gameArray[i][j].contains.color) {
                            case "red":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = pillsColors[0].imgSource
                                break
                            case "blue":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = pillsColors[1].imgSource

                                break
                            case "yellow":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = pillsColors[2].imgSource
                                break
                        }
                        document.getElementById(game.gameArray[i][j].squereId).style.transform = game.gameArray[i][j].contains.rotationAngle
                    } else {
                        document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = `url()` // psuje dodaj warunek 

                    }
                } catch (err) {}
            }

        }
    },
    dropIt: () => {
        let shouldBeRefreshed = false
        let dropItInterval = setTimeout(() => {
                for (let row = game.gameArray.length - 1; row > 0; row--) {
                    for (let column = game.gameArray[row].length - 1; column >= 0; column--) {
                        //*warunek dotyczący odpadania pojedynczych części 
                        if (game.gameArray[row][column].contains.possibleStopPoint &&
                            game.gameArray[row - 1][column].contains.shouldFall !== undefined &&
                            game.gameArray[row - 1][column].contains.shouldFall) {
                            game.dropItArrayComponent(row, column, (row - 1), column, false)
                            shouldBeRefreshed = true
                        } else
                            //*warunek opisujący opadanie pełnej tabletki w momencie ułożenia jej w pionie 
                            if (game.gameArray[row][column].contains.possibleStopPoint &&
                                game.gameArray[row - 1][column].contains.type !== undefined &&
                                game.gameArray[row - 1][column].contains.type == "pill" &&
                                game.gameArray[row - 1][column].contains.rotationAngle === 'rotate(-90deg)'
                            ) {
                                game.dropItArrayComponent(row, column, (row - 1), column, true)
                                game.dropItArrayComponent((row - 1), column, (row - 2), column, true)
                                shouldBeRefreshed = true
                            }
                        else
                            //*warunek opisujący opadanie pełnej tabletki w momencie ułożenia jej w poziomie 
                            if (game.gameArray[row][column].contains.possibleStopPoint &&
                                game.gameArray[row][column + 1] !== undefined &&
                                game.gameArray[row][column + 1].contains.possibleStopPoint &&
                                game.gameArray[row - 1][column].contains.type !== undefined &&
                                game.gameArray[row - 1][column].contains.type == "pill" &&
                                game.gameArray[row - 1][column].contains.rotationAngle === 'rotate(0deg)' &&
                                game.gameArray[row - 1][column + 1] !== undefined &&
                                game.gameArray[row - 1][column + 1].contains.type !== undefined &&
                                game.gameArray[row - 1][column + 1].contains.type == "pill" &&
                                game.gameArray[row - 1][column + 1].contains.rotationAngle === 'rotate(-180deg)'
                            ) {
                                game.dropItArrayComponent(row, column, (row - 1), column, true)
                                game.dropItArrayComponent(row, (column + 1), (row - 1), (column + 1), true)
                                shouldBeRefreshed = true
                            }
                    }
                }
                if (game.virusNumber !== 0)
                    if (shouldBeRefreshed) {
                        game.refreshNet()
                        game.dropIt()
                    } else {
                        clearInterval(dropItInterval)
                        game.refreshNet()
                        game.fallCheck(true)

                    }
                else {
                    game.refreshNet()
                    game.newLevel()
                }
            },
            10)

    },
    dropItArrayComponent: (endRow, endColumn, firstRow, firstColumn, heigherPill) => {
        delete game.gameArray[endRow][endColumn].contains //wyjściowa pozycja pola piguły 
        game.gameArray[endRow][endColumn].contains = {
            ...game.gameArray[firstRow][firstColumn].contains,
            heigherPill: heigherPill
        }
        game.gameArray[firstRow][firstColumn].contains = { //wyczyszczenie wyjścuowej 
            possibleRotation: true,
            possibleStopPoint: true
        }
    },
    lonelyPill: (row, column) => {
        if (game.gameArray[row][column].contains.possibleStopPoint && game.gameArray[row - 1][column].contains.shouldFall !== undefined && game.gameArray[row - 1][column].contains.shouldFall) {
            return {
                fall: true,
                higherPill: false
            }
            //* pigółka idąca do góry 
        } else if (game.gameArray[row][column].contains.possibleStopPoint && game.gameArray[row - 1][column] != undefined && game.gameArray[row - 1][column].contains.type == "pill" && game.gameArray[row][column - 2] != undefined && game.gameArray[row][column - 2].contains.type == "pill" && game.gameArray[row][column - 1].contains.rotationAngle == 'rotate(-90deg)') { //*dprawdzenie do jednego w góre  // wsytarczy sprawdzić jeden do przodu / jeden w góre 
            return {
                fall: true,
                higherPill: true
            }
        } else {
            return {
                fall: false,
                higherPill: false
            }
        }

    },
    //*wyniki zbić
    setNumber: (parent, score) => {
        let childsArray = Array.from(document.querySelector(`.${parent}`).childNodes).map(item => item.id)
        score = Array.from(score.toString())
        for (let indexes = 0; indexes < childsArray.length; indexes++)
            if (score[indexes] == undefined)
                score.unshift(0)
        score.forEach((index, counter) => {
            document.getElementById(childsArray[counter]).src = `./images/cyfry/${index}.png`
        })
    },
    //*generuje nowy poziom
    newLevel: () => {
        document.querySelector('.nextLevel').style.visibility = "visible"
        setTimeout(() => {
            document.querySelector('.nextLevel').style.visibility = "hidden"
            game.level++
            game.gameArray = []
            game.virusNumber = gameLevelsSettings[game.level].virusNumber
            game.createWeb()
            game.createVirusMap()
            game.refreshNet()
            game.gameArray.forEach((little) => {
                little.forEach((item) => {
                    document.getElementById(item.squereId).style.transform = rotationAngles[0]
                })
            })
            document.querySelector('.screen').style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`

            //* związane z nadawaniem wszyskich leveli i wirusów wyjściowo
            game.setNumber('gameInfoLevel', game.level)
            game.setNumber('virusNumber', game.virusNumber)
            virusAnimator.virusClasses.forEach((index) => document.querySelector(`.${index}`).style.visibility = "visible")
        }, 1000)


    }
}
const mario = {
    createAnimationNet: () => {
        for (let i = 0; i < 50; i++) {
            let frame = document.createElement('div')
            frame.id = "animNet" + i;
            document.querySelector('.pillFlyContainer').appendChild(frame)
        }
        document.querySelector('.marioContainer').style.background = `url('./images/italianoWithDrugs.png')`
    },
    catchPill: () => {
        document.querySelector('.marioContainer').style.background = `url('./images/italianoWithDrugs.png')`
        game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))]
        game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))]
        document.getElementById("animNet49").style.backgroundImage = game.pillSegmentRight.imgSource
        document.getElementById("animNet48").style.backgroundImage = game.pillSegmentLeft.imgSource
    },
    throwPill: (pillColors) => {
        let throwIntervalCounter = 0
        mario.thrower()
        let flyInterval = setInterval(() => {
            if (throwIntervalCounter !== 0) {
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.left).style.backgroundImage = `url('')`
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.right).style.backgroundImage = `url('')`
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.left).style.transform = "rotate(0deg)"
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.right).style.transform = 'rotate(180deg)'
            } //new pills background
            document.getElementById(flySchema[throwIntervalCounter].positions.left).style.backgroundImage = pillColors.left.imgSource
            document.getElementById(flySchema[throwIntervalCounter].positions.right).style.backgroundImage = pillColors.right.imgSource
            //new pills rotation
            document.getElementById(flySchema[throwIntervalCounter].positions.left).style.transform = flySchema[throwIntervalCounter].transformation.left
            document.getElementById(flySchema[throwIntervalCounter].positions.right).style.transform = flySchema[throwIntervalCounter].transformation.right
            //arrar change
            throwIntervalCounter++
            if (throwIntervalCounter === flySchema.length) {
                clearInterval(flyInterval)
                //creates new pill
                if (game.gameArray[0][3].contains.possibleStopPoint && game.gameArray[0][4].contains.possibleStopPoint) {
                    document.getElementById(flySchema[throwIntervalCounter - 1].positions.left).style.backgroundImage = `url('')`
                    document.getElementById(flySchema[throwIntervalCounter - 1].positions.right).style.backgroundImage = `url('')`
                    game.createPill()
                    game.pillPosition(3, 4)
                    pillFallInterval = setInterval(game.pillFall, 1000)
                    document.addEventListener('keydown', game.pillMove) //!!!! włącza możliwośc ruchu MOŻLIWOŚC RUCHU
                    document.addEventListener('keyup', game.pillFlag)
                    //TODO dodaj nową możliwość ruchu

                    //generate new pill colcor 
                    mario.catchPill()
                } else {
                    mario.looser()
                }
            }
        }, 100)
    },
    //*Podmienia na mario przegrywa + sprawdza i nadaje top wyniki
    looser: () => {
        document.querySelector('.marioContainer').style.background = `url('./images/sadMario.png')`
        document.querySelector('.gameOver').style.visibility = "visible"

        if (localStorage.getItem("topScore") == null || game.points > localStorage.getItem("topScore")) {
            localStorage.setItem("topScore", game.points)
            game.setNumber('nameTop', game.points)
        }
    },
    thrower: () => {
        let marioThrowAnimationCounter = 0
        let marioThrowAnimationInterval = setInterval(() => {
            marioThrowAnimationCounter++
            document.querySelector('.marioContainer').style.background = `url('./images/mario/mario${marioThrowAnimationCounter}.png`
            if (marioThrowAnimationCounter === 8)
                clearInterval(marioThrowAnimationInterval)


        }, 40)
    }

}
const lupa = {
    circularMoveInterval: null,
    pillsAnimateInterval: null,
    pillAminateCounter: 0,
    combinations: virusPositions.map((item, counter) => {
        return counter
    }),
    lupaCarusel: () => {
        if ((lupa.pillAminateCounter % 3) == 0) {
            for (let i = 0; i < 3; i++) {
                document.querySelector(`.${virusAnimator.virusClasses[i]}`).style.top = virusPositions[lupa.combinations[i]].top
                document.querySelector(`.${virusAnimator.virusClasses[i]}`).style.left = virusPositions[lupa.combinations[i]].left
            }
            lupa.combinations.unshift(lupa.combinations.pop())
        }
        lupa.pillAminateCounter++
    },
    startCarusell: () => {
        lupa.circularMoveInterval = setInterval(lupa.lupaCarusel, 1000)
    },
    destroyVirus: (color) => {
        clearInterval(lupa.circularMoveInterval)
        switch (color) {
            case "red":
                document.querySelector(`.${virusAnimator.virusClasses[2]}`).style.background = `url('./images/deadVirus1.gif')`
                setTimeout(() => document.querySelector(`.${virusAnimator.virusClasses[2]}`).style.background = `url('./images/rd/redVirus.gif')`, 2000)
                break
            case "blue":
                document.querySelector(`.${virusAnimator.virusClasses[0]}`).style.background = `url('./images/deadVirus2.gif')`
                setTimeout(() => document.querySelector(`.${virusAnimator.virusClasses[0]}`).style.background = `url('./images/bl/blueVirus.gif')`, 2000)
                break
            case "yellow":
                document.querySelector(`.${virusAnimator.virusClasses[1]}`).style.background = `url('./images/deadVirus3.gif')`
                setTimeout(() => document.querySelector(`.${virusAnimator.virusClasses[1]}`).style.background = `url('./images/yl/yellowVirus.gif')`, 2000)
                break
        }
        setTimeout(() => Object.values(game.wirusNumbers).forEach((index, number) => {
            console.log(index == 0)
            if (index == 0)
                document.querySelector(`.${virusAnimator.virusClasses[number]}`).style.visibility = "hidden"
        }), 2000)
        lupa.circularMoveInterval = null
    }

}


window.addEventListener('DOMContentLoaded', (event) => {
    game.virusNumber = gameLevelsSettings[game.level].virusNumber,
        game.createGame()
    game.createWeb()
    mario.createAnimationNet()
    game.createNumberFrame('nameTop', 'top', 7, true)
    game.createNumberFrame('nameScore', 'score', 7, true)
    game.createNumberFrame('gameInfoLevel', 'lvlInfo', 2, true)
    game.createNumberFrame('gameInfoSpeed', 'speedInfo', 2, true)
    game.createNumberFrame('virusNumber', 'virNumber', 2, true)
    game.createVirusMap()
    game.refreshNet()
    lupa.startCarusell()
    //* związane z nadawaniem wszyskich leveli i wirusów wyjściowo
    if (localStorage.getItem("topScore") == null)
        game.setNumber('nameTop', 0)
    else
        game.setNumber('nameTop', localStorage.getItem("topScore"))
    game.setNumber('gameInfoLevel', game.level)
    game.setNumber('virusNumber', game.virusNumber)
    lupa.lupaCarusel()

});