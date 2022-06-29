const apiURL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"


const getQuizzes = () => {
    axios.get(apiURL)
        .catch(err => console.log(err))
        .then(response => renderQuizzes(response.data))
}


const renderQuizzes = (quizzes) => {
    const allQuizzesContainer = document.querySelector('.all-quizzes .quizzes-container')

    quizzes.forEach(quiz => {
        allQuizzesContainer.innerHTML += `<li data-quiz-id="${quiz.id}">${quiz.title}</li>` 

        const newQuiz = allQuizzesContainer.querySelector(':last-child')
        newQuiz.style.backgroundImage = `url(${quiz.image})`
    });

    console.log(quizzes)
}


const openQuiz = () => {
    /* TO-DO */
}


getQuizzes()
