import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, difficulties } from '../data/constants';
import './Home.css';

function Home() {
    const [selection, setSelection] = useState({ cat: "", diff: "" });
    const navigate = useNavigate();

    const canStart = selection.cat !== "" && selection.diff !== "";

    const handleStart = () => {
        if (canStart) {
            navigate('/quiz', { state: selection });
        }
    };

    return (
        <div className="home-container">
            <div className="home-card">
                <h1>Quiz OpenTDB</h1>
                <p className="subtitle">Choisissez vos paramètres pour commencer</p>

                <div className="form-group">
                    <label htmlFor="category">Catégorie</label>
                    <select
                        id="category"
                        className="home-select"
                        value={selection.cat}
                        onChange={(e) => setSelection({ ...selection, cat: e.target.value })}
                    >
                        <option value="">-- Sélectionner un thème --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="difficulty">Difficulté</label>
                    <select
                        id="difficulty"
                        className="home-select"
                        value={selection.diff}
                        onChange={(e) => setSelection({ ...selection, diff: e.target.value })}
                    >
                        <option value="">-- Sélectionner le niveau --</option>
                        {difficulties.map(d => (
                            <option key={d.value} value={d.value}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn-start"
                    disabled={!canStart}
                    onClick={handleStart}
                >
                    DÉMARRER LE QUIZ
                </button>
            </div>
        </div>
    );
}

export default Home;