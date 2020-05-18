document.addEventListener('DOMContentLoaded', () => {
    // Переменные DOM
    const btnOpenModal = document.querySelector('#btnOpenModal'),
        modalBlock = document.querySelector('#modalBlock'),
        closeModal = document.querySelector('#closeModal'),
        question = document.querySelector('#question'),
        formAnswers = document.querySelector('#formAnswers'),
        prev = document.querySelector('#prev'),
        next = document.querySelector('#next'),
        send = document.querySelector('#send');

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAerJvmwATM6grkBt8yWNvVCq17PkkSFPQ",
        authDomain: "testburger-5ddef.firebaseapp.com",
        databaseURL: "https://testburger-5ddef.firebaseio.com",
        projectId: "testburger-5ddef",
        storageBucket: "testburger-5ddef.appspot.com",
        messagingSenderId: "108982519454",
        appId: "1:108982519454:web:df09224133ea77f552dd8f",
        measurementId: "G-QNVSZF80TS"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Прием данных из вне
    const getData = (url) => {
        formAnswers.textContent = 'LOAD';
        prev.classList.add('d-none');
        next.classList.add('d-none');

        firebase.database().ref().child('questions').once('value')
            .then(snap => playTest(snap.val()));

    };

    // Функции
    const toggleModal = () => {
            modalBlock.classList.toggle('d-block');
        },
        playTest = (questions) => {

            const finalAnswer = [];

            let numberQuations = 0;

            const renderQuateons = (i) => {
                    formAnswers.innerHTML = '';
                    switch (true) {
                        case (numberQuations >= 0 && numberQuations <= questions.length - 1):
                            question.textContent = `${questions[i].question}`;
                            renderAnswers(numberQuations);

                            switch (true) {
                                case (numberQuations === 0):
                                    prev.classList.add('d-none');
                                    next.classList.remove('d-none');
                                    send.classList.add('d-none');
                                    break;
                                case (numberQuations > 0 && numberQuations < (questions.length - 1)):
                                    prev.classList.remove('d-none');
                                    next.classList.remove('d-none');
                                    break;
                            };

                            prev.onclick = () => {
                                numberQuations--;
                                renderQuateons(numberQuations);
                            };
                            next.onclick = () => {
                                checkAnswer(numberQuations);
                                numberQuations++;
                                renderQuateons(numberQuations);
                            };
                            break;
                        case (numberQuations === questions.length):
                            question.textContent = 'Введите данные';
                            formAnswers.innerHTML = `
                                    <div class="form-group">
                                        <label for="numberPnone">Ваш номер телефона</label>
                                        <input type="tel" class="form-control" id="numberPnone">
                                    </div>`;

                            prev.classList.add('d-none');
                            next.classList.add('d-none');
                            send.classList.remove('d-none');

                            send.onclick = () => {
                                checkAnswer(numberQuations);
                                numberQuations++;
                                renderQuateons(numberQuations);
                                firebase
                                    .database()
                                    .ref()
                                    .child('contacts')
                                    .push(finalAnswer);
                            };
                            break;
                        case (numberQuations === questions.length + 1):
                            question.textContent = 'Спасибо за прохождение теста';
                            formAnswers.textContent = 'В ближайшее время наш менеджер свяжется с вами';

                            send.onclick = () => {
                                toggleModal();
                                numberQuations = 0;
                            };
                            break;
                    };


                },
                renderAnswers = (i) => {
                    questions[i].answers.forEach(item => {
                        const answerItem = document.createElement('div');
                        answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                        answerItem.innerHTML = `
                            <input type="${questions[i].type}" id="${item.title}" name="answer" class="d-none" value=${item.title}>
                            <label for="${item.title}" class="d-flex flex-column justify-content-between">
                                <img class="answerImg" src="${item.url}" alt="burger">
                                <span>${item.title}</span>
                            </label>`;

                        formAnswers.appendChild(answerItem);

                    });
                },
                checkAnswer = (i) => {
                    const obj = {},
                        inputs = [...formAnswers.elements].filter(input => input.checked || input.id === 'numberPnone');

                    inputs.forEach((input, index) => {
                        if (numberQuations >= 0 && numberQuations <= questions.length - 1) {
                            obj[`${index}_${questions[i].question}`] = input.value;
                        } else {
                            obj['Номер телефона'] = input.value;
                        }

                    });

                    finalAnswer.push(obj);
                };

            renderQuateons(numberQuations);

        };

    // Обработчики событий
    btnOpenModal.addEventListener('click', () => {
        toggleModal();
        getData('./questions.json');
    });

    closeModal.addEventListener('click', toggleModal);
});