let lastPostedQuiz = {};
let quiz = {
    title: "",
    image: "",
    questions: [],
    levels: []
};
let isEdit = false



function startQuizCreation(previousQuiz) {
    console.log(quiz.questions.length > 0)
    if (previousQuiz !== undefined) {
        quiz = previousQuiz
        isEdit = true
    }

    document.querySelector("main.home").classList.add("hidden");
    
    const mainCreation = document.querySelector("main.creation")
    mainCreation.classList.remove("hidden");
    mainCreation.innerHTML = `
        <h3>Comece pelo começo</h3>
        <div>
            <input placeholder="Título do seu quizz" type="text" 
            value="${quiz.title}">
            <input placeholder="URL da imagem do seu quizz" type="text" 
            value="${quiz.image}">
            <input placeholder="Quantidade de perguntas do quizz" type="text" 
            value="${(quiz.questions.length > 0) ? quiz.questions.length : ''}">
            <input placeholder="Quantidade de níveis do quizz" type="text" 
            value="${(quiz.levels.length > 0) ? quiz.levels.length : ''}">
        </div>
        <button onclick="createBasicInfo(this)">Prosseguir para criar perguntas</button>
    `;
}

function createBasicInfo(e) {
    const basicInfo = {
        title: `${e.parentNode.querySelector("input:nth-of-type(1)").value}`,
        image: `${e.parentNode.querySelector("input:nth-of-type(2)").value}`,
        nquestions: `${e.parentNode.querySelector("input:nth-of-type(3)").value}`,
        nlevels: `${e.parentNode.querySelector("input:nth-of-type(4)").value}`,
    };

    if (checkBasicInfo(basicInfo)) {
        quiz.title = basicInfo.title;
        quiz.image = basicInfo.image;
        quiz.questions.length = basicInfo.nquestions;
        quiz.questions = quiz.questions.slice(0,basicInfo.nquestions);
        quiz.levels.length = basicInfo.nlevels;
        quiz.levels = quiz.levels.slice(0,basicInfo.nlevels);

        console.log(quiz);
        startQuestionsCreation();
    
    } else
        alert("Dados incorretos!");
}
function checkBasicInfo(basicInfo) {
    const title = basicInfo.title;

    if (title.length < 20 || title.length > 65)
        return false;
    else if(Number(basicInfo.nquestions) < 3 || isNaN(basicInfo.nquestions))
        return false;
    else if (Number(basicInfo.nlevels) < 2 || isNaN(basicInfo.nlevels))
        return false;
    else if (!checkURL(basicInfo.image))
        return false;
    else
        return true;
}

function startQuestionsCreation() {
    document.querySelector("main.creation").innerHTML = '<h3>Crie suas perguntas</h3>';
    console.log(quiz.questions[0])
    
    for (let i = 0; i < quiz.questions.length; i++)
        document.querySelector("main.creation").innerHTML += `
            <div class="create questions collapsed">
                <div onclick="collapseDiv(this)">
                    <h2>Pergunta${i + 1}</h2>
                </div>
                    <ion-icon onclick="collapseDiv(this)" name="create-outline"></ion-icon>
                <div>
                    <input placeholder="Texto da pergunta" type="text" 
                    value="${(quiz.questions[i])
                        ? quiz.questions[i].title
                        : ''}">
                    <input placeholder="Cor de fundo da pergunta" type="text"
                    value="${(quiz.questions[i])
                        ? quiz.questions[i].color
                        : ''}">
                    
                    <h2>Resposta correta</h2>
                    <input placeholder="Resposta correta" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[0])
                        ? quiz.questions[i].answers[0].text
                        : ''}">
                    <input placeholder="URL da imagem" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[0]) 
                        ? quiz.questions[i].answers[0].image
                        : ''}">

                    <h2>Respostas incorretas</h2>
                    <input placeholder="Resposta incorreta 1" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[1]) 
                        ? quiz.questions[i].answers[1].text
                        : ''}">

                    <input placeholder="URL da imagem 1" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[1]) 
                        ? quiz.questions[i].answers[1].image
                        : ''}">

                    <input placeholder="Resposta incorreta 2" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[2]) 
                        ? quiz.questions[i].answers[2].text
                        : ''}">

                    <input placeholder="URL da imagem 2" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[2]) 
                        ? quiz.questions[i].answers[2].image
                        : ''}">

                    <input placeholder="Resposta incorreta 3" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[3]) 
                        ? quiz.questions[i].answers[3].image
                        : ''}">

                    <input placeholder="URL da imagem 3" type="text"
                    value="${(quiz.questions[i] && quiz.questions[i].answers[3]) 
                        ? quiz.questions[i].answers[3].image
                        : ''}">
                </div>                
            </div>
        `;
        document.querySelector("main.creation div:first-of-type").classList.remove("collapsed");
        document.querySelector("main.creation").innerHTML += `
            <button onclick="createQuestions(this)">Prosseguir para criar níveis</button>
       `; 
}

function createQuestions(e) {
    let createdQuestions = [];
    let createdAnswers = [];
    let questionElm;

    for (let i = 0; i < quiz.questions.length; i++) {
        questionElm = e.parentNode.querySelector(`div.create.questions:nth-of-type(${i + 1})`);

        createdAnswers = [];
        for (j = 0; j < 4; j++) {
            if (questionElm.querySelector(`input:nth-of-type(${3 + (j * 2)})`).value.length > 0 && questionElm.querySelector(`input:nth-of-type(${4 + (j * 2)})`).value.length > 0) {
                let jtext = questionElm.querySelector(`input:nth-of-type(${3 + (j * 2)})`).value;
                let jimage = questionElm.querySelector(`input:nth-of-type(${4 + (j * 2)})`).value;
                
                createdAnswers.push({
                    text: jtext,
                    image: jimage,
                    isCorrectAnswer: (j===0),
                });
            }
        }

        createdQuestions[i] = {
            title: `${questionElm.querySelector("input:nth-of-type(1)").value}`,
            color: `${questionElm.querySelector("input:nth-of-type(2)").value}`,
            answers: createdAnswers,
        };
    }
    
    if(checkQuestions(createdQuestions)) {
        quiz.questions = createdQuestions;
        console.log(quiz);
        startLevelsCreation();
    } else
        alert("Dados incorretos!");
}

function checkQuestions(createdQuestions) {
    for (let i = 0; i < createdQuestions.length; i++) {
        
        const isTitleShort = createdQuestions[i].title.length < 20
        if (isTitleShort) return false;
        
        const isColorValid = !checkColor(createdQuestions[i].color)
        if (isColorValid) return false;

        const isAnswersValid = createdQuestions[i].answers.length < 2
        if (isAnswersValid) return false;

        const hasCorrectAnswer = createdQuestions[i].answers[0].hasCorrectAnswer === false
        if(hasCorrectAnswer) return false;

        for (let j = 0; j < createdQuestions[i].answers.length; j++)
            if(!checkURL(createdQuestions[i].answers[j].image)) return false;
    }
    return true;
}

function startLevelsCreation() {
    document.querySelector("main.creation").innerHTML = '<h3>Agora, decida os níveis</h3>';
    for (let i = 0; i < quiz.levels.length; i++)
        document.querySelector("main.creation").innerHTML += `
            <div class="create collapsed">
                <div onclick="collapseDiv(this)">
                    <h2>Nível ${i + 1}</h2>
                </div>
                <ion-icon onclick="collapseDiv(this)" name="create-outline"></ion-icon>
                <div>
                    <input placeholder="Título do nível" type="text"
                    value="${(quiz.levels[i] && quiz.levels[i].title) 
                        ? quiz.levels[i].title
                        : ''}">

                    <input placeholder="% de acerto mínima" type="text"
                    value="${(quiz.levels[i] && quiz.levels[i].minValue) 
                        ? quiz.levels[i].minValue
                        : ''}">

                    <input placeholder="URL da imagem do nível" type="text"
                    value="${(quiz.levels[i] && quiz.levels[i].image) 
                        ? quiz.levels[i].image
                        : ''}">

                    <input placeholder="Descrição do nível" type="text"
                    value="${(quiz.levels[i] && quiz.levels[i].text) 
                        ? quiz.levels[i].text
                        : ''}">
                </div>                
            </div>
        `;
        document.querySelector("main.creation div:first-of-type").classList.remove("collapsed");
        document.querySelector("main.creation").innerHTML += `
            <button onclick="createLevels(this)">Finalizar Quiz</button>
       `;
}

function createLevels(element) {
    let createdLevels = [];
    let levelElm;

    for (let i = 0; i < quiz.levels.length; i++) {
        levelElm = element.parentNode.querySelector(`div.create:nth-of-type(${i+1})`);

        createdLevels[i] = {
            title: `${levelElm.querySelector("input:nth-of-type(1)").value}`,
            minValue: `${levelElm.querySelector("input:nth-of-type(2)").value}`,
            image: `${levelElm.querySelector("input:nth-of-type(3)").value}`,
            text: `${levelElm.querySelector("input:nth-of-type(4)").value}`,
        };
    }

    // console.log(createdLevels);
    if(checkLevels(createdLevels)) {
        quiz.levels = createdLevels;
        // console.log(quiz);
        postCreatedQuiz();
    } else
        alert("Dados incorretos!");
}

function checkLevels(createdLevels) {
    let lvlzero = false;
    for (let i = 0; i < createdLevels.length; i++) {
        
        if(createdLevels[i].title.length < 10)
            return false;
        if(isNaN(createdLevels[i].minValue) || createdLevels[i].minValue < 0 || createdLevels[i].minValue > 100)
            return false;
        if(!checkURL(createdLevels[i].image))
            return false;
        if(createdLevels[i].text.length < 30)
            return false;

        if(createdLevels[i].minValue === "0")
            lvlzero = true;
    }

    if(!lvlzero)
        return false;
    else
        return true;
}

function postCreatedQuiz() {
    if (isEdit){
        const quizKey = userStorage.get.key(`${quiz.id}`)
        const quizID = quiz.id
        console.log(quizKey)
        
        loadingScreen.show()
        delete quiz.id
        axios.put(`${apiURL}/${quizID}`, quiz, { headers: {'Secret-Key': quizKey} }).then(createQuizSuccess)
        loadingScreen.hide()
    
    } else {
        const promise = axios.post(apiURL, quiz);
        loadingScreen.show()
        promise.then(createQuizSuccess);
        loadingScreen.hide()
    }
}

function createQuizSuccess(postedQuiz) {
    lastPostedQuiz = postedQuiz;
    console.log(lastPostedQuiz.data);
    console.log(lastPostedQuiz.data.id);

    // Armazenamento
    if (!isEdit){
        userStorage.set.id(lastPostedQuiz.data.id);
        userStorage.set.key(lastPostedQuiz.data.key);
    }

    // Renderização
    setQuizzes()

    document.querySelector("main.creation").innerHTML = `
        <h3>Seu Quizz está pronto!</h3>
        <div class="create success">
            <img src="${lastPostedQuiz.data.image}">
            <p>${lastPostedQuiz.data.title}</p>
        </div>
        <button class="open-created-quiz">Acessar Quizz</button>
        <button class="button-home-quiz" onclick="document.location.reload()">Voltar pra home</button>
    `;
    document.querySelector("button.open-created-quiz").setAttribute("onclick",`exibirQuiz(lastPostedQuiz.data.id,lastPostedQuiz.data)`);

    resetCreation()
}


const resetCreation = () => {
    quiz = {
        title: "",
        image: "",
        questions: [],
        levels: []
    };

    isEdit = false
}


function collapseDiv(element) {
    element.parentNode.classList.toggle("collapsed");
}



//teste fork