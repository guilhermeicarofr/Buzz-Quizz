// VARIABLES
const apiURL = "https://mock-api.driven.com.br/api/vs/buzzquizz/quizzes"
const loadingScreen = {
    e: document.querySelector('.loader-container'),
    show: () => loadingScreen.e.classList.remove('hidden'),
    hide: () => loadingScreen.e.classList.add('hidden')
}
const userStorage = {
    set: {
        id: (value) => userStorage.save(value, 'userIDs'),
        key: (value) => userStorage.save(value, 'userKeys')
    },

    get: {
        ids: () => JSON.parse(localStorage.getItem('userIDs')),
        keys: () => JSON.parse(localStorage.getItem('userKeys')),
        key: (id) => {
            const ids = userStorage.get.ids()
            const idIndex = ids.indexOf(id)
            const quizKey = userStorage.get.keys()[idIndex]

            return quizKey
        }
    },

    save: (value, key) => {
        let userQuizzes = localStorage.getItem(key)
        console.log({value, key})

        if (!userQuizzes) {
            localStorage.setItem(key, '[\"' + value +'\"]')
        
        } else {
            const novoArray = JSON.parse(userQuizzes)
            novoArray.push(`${value}`)
            localStorage.setItem(key, JSON.stringify(novoArray))
        }
    },

    update: (id) => {
        let ids = userStorage.get.ids()
        let keys = userStorage.get.keys()
        let index = ids.indexOf(id)

        ids.splice(index, 1)
        keys.splice(index, 1)

        localStorage.setItem('userIDs', JSON.stringify(ids))
        localStorage.setItem('userKeys', JSON.stringify(keys))
    }
}
let lista = [] // lista com todos os quiz's
let quizObject;
let result = 0;
let clicks = 0;


// FUNCTIONS
const getQuizzes = async (quizId='') => {
    const response = await axios.get(`${apiURL}/${quizId}`)
    return response.data
}


const getUserQuizzes = async () => {
    const userQuizzesIds = userStorage.get.ids() || []

    if (userQuizzesIds.length > 0){  
        let promises = []
        userQuizzesIds.forEach((id) => {
            promises.push(getQuizzes(id))
        })

        let res = await Promise.all(promises)
        return res

    } else return []
}


const editQuiz = async (e) => {
    const quizElement = e.target.parentElement.parentElement
    const quizID = quizElement.dataset.id
    const quizKey = userStorage.get.key(quizID)
    
    let quiz = await getQuizzes(quizID)
    startQuizCreation(quiz)
}


const deleteQuiz = async (e) => {
    const quizElement = e.target.parentElement.parentElement
    const quizID = quizElement.dataset.id
    const quizKey = userStorage.get.key(quizID)
    console.log(quizKey)
    
    loadingScreen.show()
    let response = await axios.delete(`${apiURL}/${quizID}`, { headers: {'Secret-Key': quizKey} })
    userStorage.update(quizID)
    await setQuizzes()
    loadingScreen.hide()
    console.log({quizElement, quizID, quizKey, response})
}


const setQuizzes = async () => {
    loadingScreen.show()
    await renderQuizzes(await getQuizzes())
    await renderUserQuizzes(await getUserQuizzes())
    loadingScreen.hide()
}


const renderQuizzes = (quizzes) => {
    const allQuizzesContainer = document.querySelector('.home > .all-quizzes .quizzes-container')
    allQuizzesContainer.innerHTML = ''
    const userQuizzesIds = userStorage.get.ids() || []

    quizzes.forEach(quiz => {
        lista.push(quiz)
        const isFromUser = userQuizzesIds.some(id => id === quiz.id)        
        if (!isFromUser) allQuizzesContainer.innerHTML += `<li data-id="${quiz.id}" style="background-image: url(${quiz.image})" onclick="openQuiz(this)">${quiz.title}</li>`
    });
}


const renderUserQuizzes = (userQuizzes) => {
    if (userQuizzes.length > 0) {
        const userQuizzesContainer = document.querySelector('.home .user-quizzes .quizzes-container')
        userQuizzesContainer.innerHTML = ''
        document.querySelector('.home .user-quizzes .all-quizzes').classList.remove('hidden')
        document.querySelector('main.home .user-quizzes .empty').classList.add('hidden')
        
        userQuizzes.forEach(quiz => {
            lista.push(quiz)
            
            userQuizzesContainer.innerHTML += `
                <li data-id="${quiz.id}" style="background-image: url(${quiz.image})" onclick="openQuiz(this)">
                    <span>${quiz.title}</span>
                    <div class="options">
                        <button>
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button>
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                </li>`
        })
        
        const options = userQuizzesContainer.querySelectorAll('.options')        
        options.forEach(option => {
            // editBtn
            option.querySelector('button:first-child')
                .addEventListener('click', e => {
                    e.stopPropagation()
                    editQuiz(e)
            })

            // deleteBtn
            option.querySelector('button:nth-child(2)')
                .addEventListener('click', e => {
                    e.stopPropagation()
                    if (confirm('Tem certeza que deseja apagar este quiz?')) deleteQuiz(e)
            })
        })

    } else{
        document.querySelector('.home .user-quizzes .all-quizzes').classList.add('hidden')
        document.querySelector('main.home .user-quizzes .empty').classList.remove('hidden')
    } 
}


const openQuiz = async (e) => {
    const quizId = e.dataset.id
    let quiz;
    console.log(quizId)

    loadingScreen.show()
    quiz = await axios.get(`${apiURL}/${quizId}`)
    loadingScreen.hide()

    exibirQuiz(quizId, quiz.data)

}

function exibirQuiz (quizId, quizObj){
    quizObject = quizObj
    console.log(quizObj)
    document.body.scrollIntoView()

    document.querySelector(".home").classList.add("hidden")
    document.querySelector(".creation").classList.add("hidden")
    document.querySelector(".page02").classList.remove("hidden")

    document.querySelector(".page02").innerHTML = 
            `
            <div class="banner-quiz">
                <img src="${quizObj.image}">
                <h2>${quizObj.title}</h2>
            </div>
            <div class="main-containner-quiz"></div>
            `
    for ( let i = 0; i < quizObj.questions.length; i++){
            
        let respostas = quizObj.questions[i].answers
        console.log(respostas)
        respostas.sort(() => Math.random() - 0.5)
        console.log(respostas)

            document.querySelector(".main-containner-quiz").innerHTML += 

            `
            <div class="containner-quiz">

                <div class="question-quiz" style="background-color: ${quizObject.questions[i].color}">${quizObj.questions[i].title}</div> 

                <div class="question-options">
                </div>

            </div>
            
            `
            
            //.style.backgroundColor = "red";
       
        for (let z = 0; z < quizObj.questions[i].answers.length; z++ ){

            document.querySelectorAll(".question-options")[document.querySelectorAll(".question-options").length - 1].innerHTML += `
            <div class="question ${quizObj.questions[i].answers[z].isCorrectAnswer}" onclick="foiClicado(this)">
            <img src="${quizObj.questions[i].answers[z].image}" alt="">
            <span>${quizObj.questions[i].answers[z].text}</span>
            </div>
            `
        }
    }

}
function foiClicado (e) {
 
    let proximo = e.parentElement.parentElement.nextElementSibling

    setTimeout(function(){
    if (proximo !== null) proximo.scrollIntoView({block: "center", behavior: "smooth"});
    else document.querySelector(".containner-result-quiz").scrollIntoView({block: "center", behavior: "smooth"})
    }, 500); //2 segundos é muita coisa

    e.classList.toggle("quiz-opacity")
    clicks++
        
        
        for(let i = 1; i < (e.parentNode.childNodes.length - 1); i+=2){           
            
            if (e.parentNode.childNodes[i].className === "question true" ){

                e.parentNode.childNodes[i].classList.toggle("quiz-opacity")
                e.parentNode.childNodes[i].classList.toggle("quiz-true");
            }
            else if (e.parentNode.childNodes[i].className === "question true quiz-opacity"){

                result++
                e.parentNode.childNodes[i].classList.toggle("quiz-opacity")
                e.parentNode.childNodes[i].classList.toggle("quiz-true");
            } else {
                
                e.parentNode.childNodes[i].classList.toggle("quiz-opacity")
                e.parentNode.childNodes[i].classList.toggle("quiz-false")  
            }        
        }   
    verifyResult()
}

const backHome = () => {
    document.querySelector(".home").classList.remove("hidden")
    document.querySelector(".page02").classList.add("hidden")
    document.querySelector(".creation").classList.add("hidden")
    restartVar()
    resetCreation()
}

const restartButton = () => {
    document.querySelector(".question-options").scrollIntoView({block: "center", behavior: "smooth"});
    restartVar()
    backHome()
    exibirQuiz(quizObject.id, quizObject)
}

function restartVar () {
    result = 0;
    clicks = 0;
}

function verifyResult(){
    total = Math.round((result/quizObject.questions.length) * 100)

    if (clicks === quizObject.questions.length){
        quizObject.levels.sort(ordemCrescente)
        console.log (quizObject)
        
            for( let i = 1; i < quizObject.levels.length + 1; i++){
                if ( total >= quizObject.levels[quizObject.levels.length - i].minValue){
                    document.querySelector(".page02").innerHTML +=`
                    <div class="containner-result-quiz">
                    <div class="info-quiz">${total}% de acerto: ${quizObject.levels[quizObject.levels.length - i].title}</div>
            
                    <div class="result-quiz">
                        <img src="${quizObject.levels[quizObject.levels.length - i].image}" alt="">
                        <span>${quizObject.levels[quizObject.levels.length - i].text}</span>
                    </div>
                    </div>
                    
                    <button class="button-restart-quiz" onclick="restartButton()">Reiniciar Quizz</button>
                    <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
                    `      
                    
                    return;
                }  
            }
    }   
}

function checkURL(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    if (url != false)
        return true;
}
function checkColor(string) {
    for (let i=1 ; i<string.length ; i++)
        if(isNaN(string[i]) && !(string[i] === "A" || string[i] === "B" || string[i] === "C" || string[i] === "D" || string[i] === "E" || string[i] === "F" || string[i] === "a" || string[i] === "b" || string[i] === "c" || string[i] === "d" || string[i] === "e" || string[i] === "f"))
            return false;
    
    if(string.length != 7)
        return false;
    else if(string[0] != "#")
        return false;
    else
        return true;    
}


// Inicialização
loadingScreen.show()
setQuizzes()

let ordemCrescente = (a, b) => {
    if (a.minValue > b.minValue) {
      return 1;
    }
    if (a.minValue < b.minValue) {
      return -1;
    }
   
    return 0;
  }