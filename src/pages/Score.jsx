import { useLocation, useNavigate } from 'react-router-dom';
import './Score.css';

function Score() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const score = state?.finalScore || 0;

    const getMsg = () => {
        if (score <= 4) return "Pas génial là !";
        if (score <= 7) return "Ça commence à venir";
        return "Bravo !";
    };

    return (
        <div className="score-container">
            <div className="score-card">
                <h1>Terminé !</h1>
                <div className="final-score">{score} / 10</div>
                <p className="msg">{getMsg()}</p>
                <button className="btn-retry" onClick={() => navigate('/home')}>REJOUER</button>
            </div>
        </div>
    );
}
export default Score;