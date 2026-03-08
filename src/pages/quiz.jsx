import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeHtmlEntities } from '../data/constants';
import './Quiz.css';

function Quiz() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuestions = useCallback(() => {
        setLoading(true);
        setError(null);

        const category = state?.cat || 9;
        const difficulty = state?.diff || 'easy';

        fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`)
            .then(r => {
                if (r.status === 429) throw new Error("L'API est saturée. Attends 30 secondes avant de cliquer sur Réessayer.");
                return r.json();
            })
            .then(data => {
                if (data.response_code === 0) {
                    setQuestions(data.results);
                    setLoading(false);
                } else {
                    throw new Error("Erreur de réponse API (Code: " + data.response_code + ")");
                }
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [state]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (loading || isFinished || selectedAnswer !== null || questions.length === 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleNext(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, isFinished, selectedAnswer, questions]);

    const shuffledAnswers = useMemo(() => {
        if (!questions || questions.length === 0 || !questions[index]) return [];

        const current = questions[index];
        return [...current.incorrect_answers, current.correct_answer]
            .sort(() => Math.random() - 0.5);
    }, [questions, index]);

    const handleNext = (answer) => {
        if (selectedAnswer !== null || isFinished || questions.length === 0) return;

        setSelectedAnswer(answer);
        if (answer === questions[index]?.correct_answer) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (index < questions.length - 1) {
                setIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setTimeLeft(10);
            } else {
                setIsFinished(true);
            }
        }, 2000);
    };


    if (loading) return (
        <div className="quiz-container">
            <div className="quiz-card"><h2 className="question-text">Chargement...</h2></div>
        </div>
    );

    if (error) return (
        <div className="quiz-container">
            <div className="quiz-card">
                <h2 style={{ color: '#e74c3c' }}>Oups !</h2>
                <p>{error}</p>
                <button className="btn-ans" style={{ marginTop: '20px' }} onClick={fetchQuestions}>
                    Réessayer maintenant
                </button>
            </div>
        </div>
    );


    if (isFinished) return (
        <div className="quiz-container">
            <div className="quiz-card">
                <h2>Terminé !</h2>
                <p className="final-score">Score : {score} / {questions.length}</p>
                <button className="btn-ans" onClick={() => navigate('/home')}>Retour au menu</button>
            </div>
        </div>
    );

    const currentQuestion = questions[index];

    return (
        <div className="quiz-container">
            <div className="quiz-card">
                <div className="timer-bar-bg">
                    <div className="timer-bar-fill" style={{ width: `${timeLeft * 10}%` }}></div>
                </div>

                <p className="q-count">Question {index + 1}/{questions.length}</p>
                <h2 className="question-text">{decodeHtmlEntities(currentQuestion?.question || "")}</h2>

                <div className="grid-answers">
                    {shuffledAnswers.map((a, i) => {
                        let btnClass = "btn-ans";
                        if (selectedAnswer !== null) {
                            if (a === currentQuestion.correct_answer) btnClass += " correct";
                            else if (a === selectedAnswer) btnClass += " wrong";
                        }


                        return (
                            <button
                                key={i}
                                className={btnClass}
                                onClick={() => handleNext(a)}
                                disabled={selectedAnswer !== null}
                            >
                                {decodeHtmlEntities(a)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Quiz;