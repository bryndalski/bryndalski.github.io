let ilosc_poz = 0,
    picturesIdCheckArray = [],
    playInterval, clockInterval, gameTime = 0,
    lastMove = 5,
    whichImg = 0;
const imageToSlice = new Image() //tworze nowe img
const patternForInputs = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/ // pattern dla RegExpa zawierający wszyskie znaki specjalne. nie pozwoli na użycie ich w inpucie 
const imageSourceArray = ['./Img/AmmongPhoto.jpg', './Img/AmmongPhoto2.jpg', './Img/AmmongPhoto3.jpg']
//nadaje mu nowy src
class pictureStatistic {
    constructor(status, imgX, imgY, picturesCounter) {
        this.status = status;
        this.imgX = imgX;
        this.imgY = imgY;
        this.imgId = picturesCounter;
        this.imgPosition = picturesCounter;
    }
    possibilities(i) {
        if (picturesObjectArray[this.imgPosition - 1] != undefined && picturesObjectArray[this.imgPosition - 1].status == "EMPTY" && (this.imgPosition - 1) % i != (i - 1)) // lewo && (this.imgPosition-1)%i != 0 
            return 1;
        if (picturesObjectArray[this.imgPosition + 1] != undefined && picturesObjectArray[this.imgPosition + 1].status == "EMPTY" && (this.imgPosition + 1) % i != 0) // && this.imgId % 10 != (i - 1)
            return 2;
        if (picturesObjectArray[this.imgPosition - i] != undefined && picturesObjectArray[this.imgPosition - i].status == "EMPTY") // góra 
            return 3;
        if (picturesObjectArray[this.imgPosition + i] != undefined && picturesObjectArray[this.imgPosition + i].status == "EMPTY") // dół
            return 4
        return 0;
    }
    moveMaker(i) {
        document.querySelector('.sliceContainer').removeEventListener('click', moverRanomizer);
        let vectorForLeft = picturesObjectArray[this.imgPosition + i].imgX - picturesObjectArray[this.imgPosition].imgX
        let vectorForTop = picturesObjectArray[this.imgPosition + i].imgY - picturesObjectArray[this.imgPosition].imgY
        let intCounter = 0;
        let moveInterval = setInterval(() => {
            intCounter++;
            console.log(intCounter, )
            if (vectorForLeft > 0) {
                document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.left = (picturesObjectArray[this.imgPosition].imgX + intCounter) + '%'
                document.getElementById(this.imgPosition).style.left = (picturesObjectArray[this.imgPosition + i].imgX - intCounter) + '%'
            } else if (vectorForLeft < 0) {
                document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.left = (picturesObjectArray[this.imgPosition].imgX - intCounter) + '%'
                document.getElementById(this.imgPosition).style.left = (picturesObjectArray[this.imgPosition + i].imgX + intCounter) + '%'
            } else if (vectorForTop > 0) {
                document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.top = (picturesObjectArray[this.imgPosition].imgY + intCounter) + '%'
                document.getElementById(this.imgPosition).style.top = (picturesObjectArray[this.imgPosition + i].imgY - intCounter) + '%'
            } else {
                document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.top = (picturesObjectArray[this.imgPosition].imgY - intCounter) + '%'
                document.getElementById(this.imgPosition).style.top = (picturesObjectArray[this.imgPosition + i].imgY + intCounter) + '%'
            }
            if (intCounter == Math.floor(100 / ilosc_poz)) {
                clearInterval(moveInterval)
                document.querySelector('.sliceContainer').addEventListener('click', moverRanomizer);
            }
        }, 1);
        // document.getElementById(this.imgPosition).style.left = picturesObjectArray[this.imgPosition + i].imgX + "%" // nadanie dla kliknietego
        // document.getElementById(this.imgPosition).style.top = picturesObjectArray[this.imgPosition + i].imgY + "%"
        // document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.left = picturesObjectArray[this.imgPosition].imgX + "%"; // nadanie dla czarnego
        // document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.top = picturesObjectArray[this.imgPosition].imgY + "%"
        //podmmieniam indexy 
        // próbuję podmienić 
        let temporaryObject = this.imgPosition
        let temporaryId = picturesObjectArray[this.imgPosition + i].imgPosition
        Object.assign(picturesObjectArray[this.imgPosition], {
            status: "EMPTY",
            imgId: picturesObjectArray[this.imgPosition + i].imgId,
        })
        Object.assign(picturesObjectArray[this.imgPosition + i], {
            status: "containsImagine",
            imgId: temporaryObject
        })
        document.getElementById(this.imgPosition + i).id = temporaryObject //Pusty 
        document.getElementById(this.imgPosition).id = temporaryId
        arrayIdTaker()
        winCheck()
    }
    moveMakerForWhteBlock(i) {
        document.getElementById(this.imgPosition).style.left = picturesObjectArray[this.imgPosition + i].imgX + "%"
        document.getElementById(this.imgPosition).style.top = picturesObjectArray[this.imgPosition + i].imgY + "%"
        document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.left = picturesObjectArray[this.imgPosition].imgX + "%";
        document.getElementById(picturesObjectArray[this.imgPosition + i].imgPosition).style.top = picturesObjectArray[this.imgPosition].imgY + "%"
        //podmmieniam indexy 

        // próbuję podmienić 
        let temporaryObject = this.imgPosition
        let temporaryId = picturesObjectArray[this.imgPosition + i].imgPosition
        Object.assign(picturesObjectArray[this.imgPosition + i], {
            status: "EMPTY",
            imgId: temporaryObject
        })
        Object.assign(picturesObjectArray[this.imgPosition], {
            status: "containsImagine",
            imgId: picturesObjectArray[this.imgPosition + i].imgId,
        })
        document.getElementById(this.imgPosition).id = temporaryId
        document.getElementById(this.imgPosition + i).id = temporaryObject //Pusty 
    }
    move(i) {
        switch (this.possibilities(i)) {
            case 1: // lewo
                this.moveMaker(-1)
                return true
            case 2: // w prawo
                this.moveMaker(1)
                return true
            case 3:
                this.moveMaker(-i)
                return true
            case 4:
                this.moveMaker(+i)
                return true
            default:
                return false;
        }
    }
    whiteBoxMove(i) {
        let possibilitiesArray = this.whiteBoxPossibilities(i)
        let szukany = Math.floor((Math.random() * (possibilitiesArray.length)))
        lastMove = possibilitiesArray[szukany]
        switch (lastMove) {
            case 1: // lewo
                this.moveMakerForWhteBlock(-1)
                break;
            case 2: // w prawo
                this.moveMakerForWhteBlock(1)
                break;
            case 3:
                this.moveMakerForWhteBlock(-i)
                break;
            case 4:
                this.moveMakerForWhteBlock(+i)
                break;
        }
    }
    whiteBoxPossibilities(i) {
        let possibilitiesArray = []
        if (picturesObjectArray[this.imgPosition - 1] != undefined && (this.imgPosition - 1) % i != (i - 1) && lastMove != 2) // lewo && (this.imgPosition-1)%i != 0 
            possibilitiesArray.push(1)
        if (picturesObjectArray[this.imgPosition + 1] != undefined && (this.imgPosition + 1) % i != 0 && lastMove != 1) // && this.imgId % 10 != (i - 1)
            possibilitiesArray.push(2)
        if (picturesObjectArray[this.imgPosition - i] != undefined && lastMove != 4) // góra 
            possibilitiesArray.push(3)
        if (picturesObjectArray[this.imgPosition + i] != undefined && lastMove != 3) // dół
            possibilitiesArray.push(4)
        return possibilitiesArray;
    }
}
var picturesObjectArray = []
window.addEventListener('DOMContentLoaded', (event) => {
    gameStarter()
});

function buttonMaker() {
    let buttonContainer = document.body.querySelector('.buttonContainer');
    for (i = 3; i <= 6; i++) {
        let buttonek = document.createElement('button')
        buttonek.appendChild(document.createTextNode(i + " X " + i))
        buttonek.onclick = buttonkoweSlicowanie(i);
        buttonContainer.appendChild(buttonek)
    }
    let buttonek = document.createElement('button')
    buttonek.appendChild(document.createTextNode("Pokaż wyniki"))
    buttonek.onclick = displayResults;
    buttonContainer.appendChild(buttonek)
    let arrowLeft = document.createElement('button')
    let arrowRight = document.createElement('button')
    arrowLeft.textContent = "<"
    arrowLeft.classList.add('leftArrow')
    arrowRight.classList.add('rightArrow')
    arrowRight.textContent = '>'
    buttonContainer.appendChild(arrowLeft)
    buttonContainer.appendChild(arrowRight)
    arrowRight.addEventListener('click', slideUp)
    arrowLeft.addEventListener('click', slideShowDown)

}
// funckja wywołana, pozwala na acess po tzw I do ilość buttonó itp
function buttonkoweSlicowanie(i) {
    return function () {
        restarter()
        document.querySelector('.sliceContainer').appendChild(document.createElement('img'))
        restarter(i)
        imageSlicer(i)
        ilosc_poz = i;
    }
}
//funckja robiąca kwadrary 
function imageSlicer(i) {
    let imageWidth = Math.round(imageToSlice.width / i); // pobieram width zdjęcia i dziele je przez ilość obrazków w celu uzyskania wiadomości ile jest potrzebne
    let imageHeight = Math.floor(imageToSlice.height / i); // pobieram height zdjęcia i dziele je przez ilość obrazków w celu uzyskania wiadomości ile jest potrzebne
    let picturesCounter = 0
    //drawImage(zdjęcie , pozycja_wejściowego_X,pozycja_Wejściowego_Y,wejściowy_Width,WejściowyHeight,WyjściowyX,WyjściowyY,WyjścioweWidth,WyjścioweHeight)
    for (y = 0; y < i; y++) {
        for (x = 0; x < i; x++) {
            //tworzneie canvasu
            let imageCanvas = document.createElement('canvas') // tworzę moje płutno ponieważ tylko na tym moge pracować
            imageCanvas.width = imageWidth; //nadaję dla canwasImagu
            imageCanvas.height = imageHeight //
            imageCanvas.id = picturesCounter; // nadaje id dla canvasu
            let size = 100;
            if (i == 6) {
                size -= 3
            }
            imageCanvas.style.top = Math.floor(((size / i) * y)) + "%" // ustawiam bezwzględną pozycje względem topa
            imageCanvas.style.left = Math.floor(((size / i) * x)) + "%" // ustawiam bezwzględną pozycję wg left
            imageCanvas.classList.add('canvasNumber' + i) // nadaję specjalną klasę stworzoną pod responwyność 
            let contextOfSliceableImage = imageCanvas.getContext('2d') //pobieram kontekst z płótna
            if (picturesCounter == i ** 2 - 1) {
                picturesObjectArray.push(new pictureStatistic("EMPTY", Math.floor(((size / i) * x)), Math.floor(((size / i) * y)), picturesCounter))
                imageCanvas.classList.add("empty")
            }
            if (picturesCounter < i ** 2 - 1) {
                console.log(Math.floor(((100 / i) * x)), Math.floor(((100 / i) * y)))
                picturesObjectArray.push(new pictureStatistic("containsImagine", Math.floor(((size / i) * x)), Math.floor(((size / i) * y)), picturesCounter))
                contextOfSliceableImage.drawImage(imageToSlice, imageWidth * x, imageHeight * y, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight)
            }
            picturesCounter++;
            document.querySelector('.sliceContainer').appendChild(imageCanvas)
        }
    }
    let intervalCounter = i * i * 10
    playInterval = setInterval(function () {
        intervalCounter--
        picturesObjectArray[picturesObjectArray.find(e => e.status == "EMPTY").imgPosition].whiteBoxMove(i)
        if (intervalCounter <= 0) {
            firstDate = Date.now()
            clockInterval = setInterval(clock, 1)
            arrayIdTaker()
            clearInterval(playInterval)
            document.querySelector('.sliceContainer').addEventListener('click', moverRanomizer);
        }
    }, 1)
}
//ruch
function moverRanomizer(e) {
    arrIdCheck()
    if (picturesObjectArray[e.target.id] != null)
        picturesObjectArray[e.target.id].move(ilosc_poz)
}
//zegar
function clock() {
    let newHour = new Date(Date.now() - firstDate)
    let timeArray = ["00", ":", "00", ":", "00", ":", "000"];
    //dla milisekind
    if (parseInt(newHour.getMilliseconds()) < 10)
        timeArray[6] = "00" + newHour.getMilliseconds()
    else if (parseInt(newHour.getMilliseconds()) < 100)
        timeArray[6] = "0" + newHour.getMilliseconds()
    else
        timeArray[6] = newHour.getMilliseconds()
    //dla sekund 
    if (parseInt(newHour.getSeconds()) < 10)
        timeArray[4] = "0" + newHour.getSeconds()
    else
        timeArray[4] = newHour.getSeconds()
    //dla minut
    if (parseInt(newHour.getMinutes()) < 10)
        timeArray[2] = "0" + newHour.getMinutes()
    else
        timeArray[2] = newHour.getMinutes()
    //dla godzin
    if (parseInt(newHour.getHours()) < 10)
        timeArray[0] = "0" + (newHour.getHours() - 1)
    else
        timeArray[0] = (newHour.getHours() - 1)
    gameTime = timeArray.join('')
    clockImageSetter(timeArray)
}

function clockImageSetter(time) {
    let newTime = time.join('')
    time = newTime.split('')
    let imagePath = ''
    for (i = time.length - 1; i >= 0; i--) {
        switch (time[i]) {
            case ":":
                imagePath = "./digits/Ddots.gif"
                break;
            case "0":
                imagePath = "./digits/zeroIco.gif"
                break;
            case "1":
                imagePath = "./digits/oneIco.gif"
                break;
            case "2":
                imagePath = "./digits/twoIco.gif"
                break;
            case "3":
                imagePath = "./digits/threeIco.gif"
                break;
            case "4":
                imagePath = "./digits/fourIco.gif"
                break;
            case "5":
                imagePath = "./digits/fiveIco.gif"
                break;
            case "6":
                imagePath = "./digits/sixIco.gif"
                break;
            case "7":
                imagePath = "./digits/sevenIco.gif"
                break;
            case "8":
                imagePath = "./digits/eightIco.gif"
                break;
            case "9":
                imagePath = "./digits/nineIco.gif"
                break;
        }
        document.body.querySelector('.time img:nth-child(' + (i + 1) + ')').src = imagePath;
    }
}

//wygrana 
function winCheck() {
    let check = true;
    for (x = 0; x < picturesObjectArray.length; x++) {
        if (document.body.querySelector('.sliceContainer canvas:nth-child(' + (x + 1) + ')').id != picturesObjectArray[x].imgPosition) {
            check = false
            break;
        }
    }
    if (check) {
        document.querySelector('.sliceContainer').removeEventListener('click', moverRanomizer);
        //black background
        let overLay = document.createElement('div')
        overLay.classList.add('overLay');
        document.body.appendChild(overLay)
        //button
        clearInterval(clockInterval)
        let dvContainer = document.createElement('div')
        dvContainer.classList.add('alertClass')
        let noteContainer = document.createElement('h1')
        noteContainer.appendChild(document.createTextNode("Your Time  " + gameTime))
        dvContainer.appendChild(noteContainer)

        let buttonShow = document.createElement('button')
        buttonShow.appendChild(document.createTextNode('Save'))
        buttonShow.onclick = function () {
            Save()
        }
        let buttonStats = document.createElement('button')
        buttonStats.appendChild(document.createTextNode('top 10'))
        buttonStats.onclick = function () {
            displayResults()
        }
        dvContainer.appendChild(buttonStats)
        dvContainer.appendChild(buttonShow)
        document.body.appendChild(dvContainer)
    }
}

// funckje zabezpieczające próbe zmiany id i oszustwa 
function arrIdCheck() {
    for (x = 0; x < document.body.querySelector('.sliceContainer').childElementCount; x++) {
        if (document.body.querySelector('.sliceContainer canvas:nth-child(' + (x + 1) + ')').id != picturesIdCheckArray[x]) {
            alert("Wykryto nieuczciwą zmienę ID, to bardzo NIE ŁADNE PODEJŚCIE. Strona teraz ma focha i się reloaduje. Nie pozdrawam.")
            window.location.reload(true)
            break;
        }
    }
}

function arrayIdTaker() {
    picturesIdCheckArray = []
    for (x = 0; x < document.body.querySelector('.sliceContainer').childElementCount; x++) {
        picturesIdCheckArray.push(document.body.querySelector('.sliceContainer canvas:nth-child(' + (x + 1) + ')').id)
    }
}

// cookies + tabela koxów
// formularz do wprowadzania nicku
function gameStarter() {
    document.body.innerHTML = '' // czyści body 
    //towrzę slider 
    let imagine = document.createElement('div');
    //slider img
    let slideImagine = document.createElement('img')
    slideImagine.src = imageSourceArray[0]
    imagine.appendChild(slideImagine)
    imagine.classList.add('spooky_img')
    //tworzę container z czasem
    let timeCont = document.createElement('div');
    timeCont.classList.add('time')
    for (i = 0; i < 12; i++) {
        let digit = document.createElement('img')
        timeCont.appendChild(digit)
        if (i == 2 || i == 5 || i == 8)
            digit.src = './digits/Ddots.gif'
        else
            digit.src = './digits/zeroIco.gif'
    }
    //buttonki
    let buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')

    // tworzę image slicera
    let slicer = document.createElement('div')
    slicer.classList.add('sliceContainer')
    let imgForSlicer = document.createElement('img')
    imgForSlicer.src = './Img/loadingScreen.gif';
    slicer.appendChild(imgForSlicer)
    document.body.appendChild(imagine) // dodawanie obazka
    document.body.appendChild(slicer)
    document.body.appendChild(timeCont)
    document.body.appendChild(buttonContainer)


    buttonMaker();
    imageToSlice.src = imageSourceArray[whichImg]


}

function slideUp() {
    //wyłączam buttony 
    document.body.querySelector('.leftArrow').removeEventListener('click', slideShowDown)
    document.body.querySelector('.rightArrow').removeEventListener('click', slideUp)

    whichImg++
    if (whichImg == imageSourceArray.length) //ide do przodu 
        whichImg = 0;
    else if (whichImg < 0) // cofam
        whichImg = imageSourceArray.length - 1;
    // przesuwam do prawej 
    let slideImagine = document.createElement('img')
    slideImagine.src = imageSourceArray[whichImg] // src nadane
    slideImagine.setAttribute('position', 'absolute')
    document.querySelector('.spooky_img').appendChild(slideImagine)
    let destination = 0;
    let interwal = setInterval(() => {
        destination++;
        document.querySelector('.spooky_img :first-child').style.left = -1 * destination + "%"
        document.querySelector('.spooky_img :nth-child(2)').style.left = -1 * destination + "%"
        if (destination == 100) {
            clearInterval(interwal)
            document.querySelector('.spooky_img :first-child').remove()
            document.querySelector('.spooky_img :first-child').style.left = 0 + "px"
            document.body.querySelector('.leftArrow').addEventListener('click', slideShowDown)
            document.body.querySelector('.rightArrow').addEventListener('click', slideUp)

        }
        document.querySelector('.spooky_img').scroll(1, 0)
    }, 3);

    imageToSlice.src = imageSourceArray[whichImg] // ustawia courrent slice img

}

function slideShowDown() {
    //wyłączam buttony 
    document.body.querySelector('.leftArrow').removeEventListener('click', slideShowDown)
    document.body.querySelector('.rightArrow').removeEventListener('click', slideUp)
    whichImg--
    if (whichImg == imageSourceArray.length) //ide do przodu 
        whichImg = 0;
    else if (whichImg < 0) // cofam
        whichImg = imageSourceArray.length - 1;
    let slideImagine = document.createElement('img')
    slideImagine.src = imageSourceArray[whichImg] // src nadane
    slideImagine.setAttribute('position', 'absolute')
    slideImagine.style.left = '-100%'
    document.querySelector('.spooky_img').prepend(slideImagine)
    let destination = 0;
    let interwal = setInterval(() => {
        destination++;
        document.querySelector('.spooky_img :first-child').style.left = -1 * (100 - destination) + "%"
        document.querySelector('.spooky_img :nth-child(2)').style.left = -1 * (100 - destination) + "%"
        if (destination == 100) {
            clearInterval(interwal)
            document.querySelector('.spooky_img :nth-child(2)').remove()
            document.querySelector('.spooky_img :first-child').style.left = 0 + "px"
            document.body.querySelector('.leftArrow').addEventListener('click', slideShowDown)
            document.body.querySelector('.rightArrow').addEventListener('click', slideUp)
        }
        document.querySelector('.spooky_img').scroll(1, 0)
    }, 3);
    imageToSlice.src = imageSourceArray[whichImg] // ustawia courrent slice img

}

//funckaj restartuje gre : czyści tablice usuwa container ==> dzieci i tworzy na nowo
function restarter() {
    clearInterval(playInterval);
    clearInterval(clockInterval)
    gameTime = 0
    lastMove = 5
    clockImageSetter(["00", ":", "00", ":", "00", ":", "000"]);
    picturesObjectArray = []
    if (document.body.querySelector('.sliceContainer') != null)
        document.body.querySelector('.sliceContainer').remove()
    let spooksCont = document.createElement('div')
    spooksCont.classList.add('sliceContainer')
    document.body.appendChild(spooksCont)
}
//dla buttonu
function Save() {
    document.body.innerHTML = '' // czyści body 
    //container na formularz
    let fomrContainer = document.createElement('div')
    fomrContainer.classList.add('formContainer')
    //input Type Text
    let textInput = document.createElement('input')
    textInput.type = 'text'
    //status
    let status = document.createElement('p')
    status.appendChild(document.createTextNode('Enter Nickname'))
    //submit
    let submit = document.createElement('button')
    submit.textContent = "Zapisz wynik"
    submit.onclick = () => {
        cookieMaker(textInput.value)
    }
    fomrContainer.appendChild(textInput)
    fomrContainer.appendChild(status)
    fomrContainer.appendChild(submit)
    document.body.appendChild(fomrContainer)
    textInput.addEventListener('input', nickNamePossibilityChecker)
}

function cookieMaker(nick) {
    let cookieContent = cookieToJSONMaker(gameTypeForCookieId())
    if (nickNamePossibilityChecker()) {
        let cookieObject = {
            name: nick,
            time: gameTime
        }
        cookieContent.push(cookieObject)
        document.cookie = gameTypeForCookieId() + "=" + JSON.stringify(cookieContent);

        //tworzę wiadomośc 
        let container = document.querySelector('div')
        container.innerHTML = ''
        let text = document.createElement('p')
        text.textContent = "Twój nick został zapisany poprawnie"
        let exitBty = document.createElement('button')
        let okButton = document.createElement('button')
        exitBty.textContent = "Wyniki"
        exitBty.onclick = displayResults;
        okButton.textContent = "Menu główne"
        okButton.onclick = gameStarter;
        container
        container.appendChild(text)
        container.appendChild(okButton)
        container.appendChild(exitBty)
    } else {
        alert("Nie można zapisać takich danych")
    }
}
//zwraca który cookie ma pobrać funckcja 
function gameTypeForCookieId() {
    switch (ilosc_poz) {
        case 3:
            return "3vs3Stats"
        case 4:
            return "4vs4Stats"
        case 5:
            return "5vs5Stats"
        case 6:
            return "6vs6Stats"
        default:
            return "3vs3Stats"
    }
}
//sprawdzanie działania nicku 
function nickNamePossibilityChecker() {
    let inputValue = document.querySelector("input").value;
    if (inputValue == '') {
        document.body.querySelector('p').textContent = "Wpisz nick "
        return false;
    } else if (inputValue.length > 20) {
        document.body.querySelector('p').textContent = "Przekroczono maksymalną długość nicku "
        return false;
    } else if (patternForInputs.test(inputValue)) {
        document.body.querySelector('p').textContent = "Niepoprawne znaki "
        return false;
    } else {
        let doubleNick = cookieToJSONMaker().find(element => element.name == inputValue);
        if (doubleNick != undefined) {
            document.body.querySelector('p').textContent = "Ten nick jest już zajęty "
            return false;
        } else {
            document.body.querySelector('p').textContent = "Nick Wolny"
            return true;
        }
    }
}

function cookieToJSONMaker() {
    let documentCookies = document.cookie
    documentCookies = documentCookies.split('; ')
    let searchingPattern = new RegExp("^" + gameTypeForCookieId() + "=*")
    let found = documentCookies.filter(indexLike => searchingPattern.test(indexLike)); //!!!3 vs3Stats!!!wyszukuje index z Username.Używam regexa żeby znalazł dopasowanie do końca lini do nazwy moego cookie
    if (found != undefined && found.length != 0) {
        found = found[0].substring(10) // wyszukany index zmieniam do formatu podatnego na JSONA 
        found = JSON.parse(found)
    }
    return found
}
//pokazywanie wyników - tworzy wybów przycisków == wybór trybów gry 
function displayResults() {
    clearInterval(playInterval);
    clearInterval(clockInterval)
    document.body.innerHTML = '' //czyszcze
    let buttonContainer = document.createElement('div')
    buttonContainer.classList.add('dispalyResultsButtons')
    for (i = 3; i <= 6; i++) {
        let buttonik = document.createElement('button')
        buttonik.textContent = i + " na " + i;
        buttonik.onclick = playViewReturn(i)
        buttonContainer.appendChild(buttonik)
    }
    document.body.appendChild(buttonContainer)

}
//pomocnicza do funkcji zminia kilka rzeczy , z
function playViewReturn(x) {
    return function () {
        ilosc_poz = x
        sorterArrayMaker()
    }
}
// tworzy tabele z wynikami / sortuje ją i wyswietla top 10 dla wybranego przez siebie wyniku 
function sorterArrayMaker() {
    clearInterval(playInterval);
    clearInterval(clockInterval)
    let arrayToSort = cookieToJSONMaker()
    arrayToSort.sort((a, b) => {
        return parseInt(a.time.replace(/:/g, "")) - parseInt(b.time.replace(/:/g, ""))
    });
    //tworzenie tabeli 
    document.body.innerHTML = ''
    //tworze tabele wyników
    let table = document.createElement('table')
    // description
    let row = document.createElement('tr')
    for (i = 0; i < 3; i++) {
        let cell = document.createElement('th')
        switch (i) {
            case 0:
                cell.textContent = "Miejsce"
                break;
            case 1:
                cell.textContent = "Nikk"
                break;
            case 2:
                cell.textContent = "Czas"
                break;
        }
        row.appendChild(cell)
    }
    table.appendChild(row)
    for (i = 0; i < 10; i++) {
        let row = document.createElement('tr')
        for (x = 0; x < 3; x++) {
            let cell = document.createElement('th')
            if (arrayToSort[i] == undefined)
                switch (x) {
                    case 0:
                        cell.textContent = i + 1
                        break;
                    case 1:
                    case 2:
                        cell.textContent = 'BRAK '
                        break;
                }
            else
                switch (x) {
                    case 0:
                        cell.textContent = i + 1
                        break;
                    case 1:
                        cell.textContent = arrayToSort[i].name;
                        break;
                    case 2:
                        cell.textContent = arrayToSort[i].time
                        break;
                }
            row.appendChild(cell)
        }
        table.appendChild(row)
    }
    //tworzenie buttona dla nowej gry
    let buttonNewGame = document.createElement('button')
    buttonNewGame.textContent = "Nowa gra"
    buttonNewGame.onclick = gameStarter;
    //tworze    
    let buttonRestartGame = document.createElement('button')
    buttonRestartGame.textContent = "Pokaż wyniki"
    buttonRestartGame.onclick = displayResults;
    //na to container
    let container = document.createElement('div')
    container.classList.add('resultsContainer')


    document.body.appendChild(table)
    container.appendChild(buttonNewGame)
    container.appendChild(buttonRestartGame)
    document.body.appendChild(container)
}