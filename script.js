// We will populate this file later to load images and handle logic.
document.addEventListener('DOMContentLoaded', () => {
    const problemImage = document.getElementById('problem-image');
    const showAnswerButton = document.getElementById('show-answer-button');
    const answerDisplay = document.getElementById('answer-display');
    const correctAnswerText = document.getElementById('correct-answer-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackYesButton = document.getElementById('feedback-yes');
    const feedbackNoButton = document.getElementById('feedback-no');
    const prevButton = document.getElementById('prev-problem');
    const nextButton = document.getElementById('next-problem');
    const returnToMenuButton = document.getElementById('return-to-menu');
    const levelSelectionContainer = document.getElementById('level-selection-container');
    const navigationContainer = document.getElementById('navigation-container');
    const problemContainer = document.getElementById('problem-container');
    const answerContainer = document.getElementById('answer-container');

    const problemAnswers = {
        "2014-18.png": { option: "D", content: "5/9" },
        "2019-14.png": { option: "C", content: "Wednesday（星期三）" },
        "2019-16.png": { option: "D", content: "3" },
        "2019-18.png": { option: "C", content: "36" },
        "2019-19.png": { option: "C", content: "3" },
        "2019-20.png": { option: "D", content: "4" },
        "2019-25.png": { option: "C", content: "190" },
        "2022-14.png": { option: "C", content: "7" },
        "2022-17.png": { option: "B", content: "2" },
        "2022-25.png": { option: "E", content: "1/4" },
        "2023-16.png": { option: "B", content: "6" },
        "2023-18.png": { option: "C", content: "1/2" },
        "2023-21.png": { option: "C", content: "2" },
        "2023-23.png": { option: "C", content: "1/3" }
    };

    const allProblemFiles = {
        level1: [], // Problems 1-19
        level2: [], // Problems 20-23
        level3: []  // Problems 24-25
    };

    const rawFileNames = [
        "2014-18.png", "2019-14.png", "2019-16.png", "2019-18.png",
        "2019-19.png", "2019-20.png", "2019-25.png", "2022-14.png",
        "2022-17.png", "2022-25.png", "2023-16.png", "2023-18.png",
        "2023-21.png", "2023-23.png"
    ];

    rawFileNames.forEach(filename => {
        const parts = filename.split('-');
        if (parts.length === 2) {
            const problemNumber = parseInt(parts[1].split('.')[0]);
            if (!isNaN(problemNumber)) {
                if (problemNumber >= 1 && problemNumber <= 19) {
                    allProblemFiles.level1.push(filename);
                } else if (problemNumber >= 20 && problemNumber <= 23) {
                    allProblemFiles.level2.push(filename);
                } else if (problemNumber >= 24 && problemNumber <= 25) {
                    allProblemFiles.level3.push(filename);
                }
            }
        }
    });

    let currentLevelProblems = [];
    let currentProblemIndex = 0;
    let problemHistory = []; // To keep track of shown problems for 'Previous' button
    let currentLevel = null; // To store the currently selected level (e.g., 'level1', 'level2')
    let correctlyAnsweredProblems = {
        level1: new Set(),
        level2: new Set(),
        level3: new Set()
    };

    // shuffleArray function is no longer needed as problems will be in order.
    // function shuffleArray(array) {
    //     for (let i = array.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    //     }
    // }

    function loadProblemInSequence() { // Renamed from loadRandomProblem
        if (currentLevelProblems.length === 0) {
            problemImage.src = '';
            problemImage.alt = 'No problems available for this level or all problems shown.';
            // answerInput.value = ''; // Removed as input field is gone
            return;
        }
        // Logic for random selection is removed.
        // currentProblemIndex will now be managed by next/prev buttons and level selection.
        // Ensure currentProblemIndex is within bounds.
        if (currentProblemIndex < 0) currentProblemIndex = 0;
        if (currentProblemIndex >= currentLevelProblems.length) {
            // This case should ideally be handled by disabling next button or showing completion message
            // For now, let's loop back or show a message
            if (currentLevelProblems.length > 0) {
                 // Or, alert('You have reached the end of the problems for this level.');
                 // problemImage.alt = 'All problems shown for this level.';
                 // return; // Or loop to the first problem
                 currentProblemIndex = 0; // Loop to first problem for now
            } else {
                problemImage.src = '';
                problemImage.alt = 'No problems available for this level.';
                return;
            }
        }
        const problemFile = currentLevelProblems[currentProblemIndex];
        problemImage.src = `Question Bank/${problemFile}`;

        if (correctlyAnsweredProblems[currentLevel] && correctlyAnsweredProblems[currentLevel].has(problemFile)) {
            const answerData = problemAnswers[problemFile];
            correctAnswerText.textContent = `已回答正确，正确答案是:  (${answerData.content})`;
            answerDisplay.style.display = 'block';
            showAnswerButton.style.display = 'none';
            feedbackContainer.style.display = 'none';
        } else {
            answerDisplay.style.display = 'none';
            showAnswerButton.style.display = 'inline-block';
            feedbackContainer.style.display = 'block'; // Or 'flex' if it's a flex container
            correctAnswerText.textContent = ''; // Clear previous answer
        }

        // Add to history, but don't add if it's the same as the last one (e.g. only one problem in level)
        if (problemHistory.length === 0 || problemHistory[problemHistory.length -1] !== problemFile) {
             problemHistory.push(problemFile);
        }
    }
    
    function loadSpecificProblem(problemFile) {
        problemImage.src = `Question Bank/${problemFile}`;
        currentProblemIndex = currentLevelProblems.indexOf(problemFile);

        if (correctlyAnsweredProblems[currentLevel] && correctlyAnsweredProblems[currentLevel].has(problemFile)) {
            const answerData = problemAnswers[problemFile];
            correctAnswerText.textContent = `已回答正确，正确答案是:  (${answerData.content})`;
            answerDisplay.style.display = 'block';
            showAnswerButton.style.display = 'none';
            feedbackContainer.style.display = 'none';
        } else {
            answerDisplay.style.display = 'none';
            showAnswerButton.style.display = 'inline-block';
            feedbackContainer.style.display = 'block'; // Or 'flex'
            correctAnswerText.textContent = '';
        }
    }

    levelSelectionContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const levelValue = event.target.dataset.level; // e.g., "1", "2", "3"
            currentLevel = `level${levelValue}`; // Convert to 'level1', 'level2', 'level3'
            problemHistory = []; // Reset history for new level
            switch (levelValue) {
                case '1':
                    currentLevelProblems = [...allProblemFiles.level1];
                    break;
                case '2':
                    currentLevelProblems = [...allProblemFiles.level2];
                    break;
                case '3':
                    currentLevelProblems = [...allProblemFiles.level3];
                    break;
                default:
                    currentLevelProblems = [];
            }
            // shuffleArray(currentLevelProblems); // Problems will be in order, no shuffle.
            currentProblemIndex = 0; // Start from the first problem
            levelSelectionContainer.style.display = 'none';
            problemContainer.style.display = 'block';
            answerContainer.style.display = 'block';
            navigationContainer.style.display = 'flex'; // Show navigation
            loadProblemInSequence();
        }
    });

    showAnswerButton.addEventListener('click', () => {
        const currentProblemFile = currentLevelProblems[currentProblemIndex];
        if (problemAnswers[currentProblemFile]) {
            const answerData = problemAnswers[currentProblemFile];
            correctAnswerText.textContent = `正确答案是: (${answerData.content})`;
            answerDisplay.style.display = 'block';
            showAnswerButton.style.display = 'none'; // Hide button after showing answer
            feedbackContainer.style.display = 'block'; // Make sure feedback is visible
        } else {
            correctAnswerText.textContent = '答案未找到。';
            answerDisplay.style.display = 'block';
            showAnswerButton.style.display = 'none';
            feedbackContainer.style.display = 'block'; // Make sure feedback is visible
        }
    });

    feedbackYesButton.addEventListener('click', () => {
        const problemFile = currentLevelProblems[currentProblemIndex];
        console.log(`Feedback for ${problemFile}: Correct`);
        alert('反馈已记录：回答正确！');
        // No automatic loading of next problem here, user clicks 'Next'
        // loadProblemInSequence(); // Removed, next problem loaded by button click

        if (currentLevel && problemFile) {
            correctlyAnsweredProblems[currentLevel].add(problemFile);

            let allProblemsInCurrentLevel;
            if (currentLevel === 'level1') allProblemsInCurrentLevel = allProblemFiles.level1;
            else if (currentLevel === 'level2') allProblemsInCurrentLevel = allProblemFiles.level2;
            else if (currentLevel === 'level3') allProblemsInCurrentLevel = allProblemFiles.level3;

            if (allProblemsInCurrentLevel && correctlyAnsweredProblems[currentLevel].size === allProblemsInCurrentLevel.length) {
                setTimeout(() => {
                    alert('恭喜你，已全部正确完成本级别所有题目！');
                    problemContainer.style.display = 'none';
                    navigationContainer.style.display = 'none';
                    answerContainer.style.display = 'none';
                    levelSelectionContainer.style.display = 'block';
                    // Optionally reset the correctly answered set for the level if the user wants to replay
                    // correctlyAnsweredProblems[currentLevel].clear(); 
                }, 100);
                return; // Stop further execution
            }
        }

        answerDisplay.style.display = 'none';
        showAnswerButton.style.display = 'inline-block';
        // loadProblemInSequence(); // Next problem loaded by button click
    });

    feedbackNoButton.addEventListener('click', () => {
        console.log(`Feedback for ${currentLevelProblems[currentProblemIndex]}: Incorrect`);
        alert('反馈已记录：回答错误。');
        // Optionally, move to next problem or reset UI
        answerDisplay.style.display = 'none';
        showAnswerButton.style.display = 'inline-block';
        // loadProblemInSequence(); // Next problem loaded by button click
    });

    nextButton.addEventListener('click', () => {
        if (currentProblemIndex < currentLevelProblems.length - 1) {
            currentProblemIndex++;
            loadProblemInSequence();
        } else {
            // Optionally, alert that it's the last problem or disable the button
            alert('这是本级别的最后一个问题了。');
            // If all problems are completed and correctly answered, the main completion logic handles it.
            // If just reached end of sequence but not all correct, this alert is fine.
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentProblemIndex > 0) {
            currentProblemIndex--;
            loadProblemInSequence(); // Use the main loading function
        } else {
            alert('这已经是本级别的第一个问题了。');
        }
        // problemHistory logic might need adjustment or removal if strictly sequential
        // For now, loadSpecificProblem was already modified to use currentProblemIndex
        // and loadProblemInSequence will also use it.
        // The history was mainly for random jumps, sequential doesn't need it as much for prev/next.
    });

    // Removed submitButton event listener as it's no longer in HTML

    console.log('Script loaded. Waiting for level selection.');

    returnToMenuButton.addEventListener('click', () => {
        problemContainer.style.display = 'none';
        answerContainer.style.display = 'none';
        navigationContainer.style.display = 'none';
        levelSelectionContainer.style.display = 'block';
        // Optionally, reset currentLevel and other states if needed
        currentLevel = null;
        currentLevelProblems = [];
        problemHistory = [];
        // Don't clear correctlyAnsweredProblems here if you want to preserve cross-session/level completion status
    });
});
