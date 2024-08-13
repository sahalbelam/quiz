import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Questioncard = () => {
    const [questions, setQuestions] = useState([]); 
    const [questionIndex, setQuestionIndex] = useState(0); 
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const quiz = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
            setQuestions(response.data.results); 
            setQuestionIndex(0); 
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        quiz();
    }, []);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const currentQuestion = questions[questionIndex]; // Get the current question

    let allAnswers = [];
    if (currentQuestion) {
        allAnswers = shuffleArray([...currentQuestion.incorrect_answers, currentQuestion.correct_answer]);
    }

    const checkAnswer = (selectedAnswer) => {
        if (selectedAnswer === currentQuestion.correct_answer) {
            setScore(score => score + 1);
        }

        // Move to the next question or show the result
        setQuestionIndex(prevIndex => prevIndex + 1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentQuestion) {
        return <div>Quiz Completed! Your score is {score}.</div>;
    }

    const decodedQuestion = currentQuestion.question
        .replace(/&quot;/g, '"')
        .replace(/&rsquo;/g, "'")
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&");

    return (
        <div>
            <h2>{decodedQuestion}</h2>
            <div>
                Score: {score}
                <ul>
                    {allAnswers.map((answer, index) => (
                        <li key={`${index}-${answer}`}>
                            <button onClick={() => checkAnswer(answer)}>{answer}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Questioncard;
