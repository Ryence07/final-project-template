import { useState } from 'react'
import PaddleCard from '../components/PaddleCard'
import PaddleDetailsModal from '../components/PaddleDetailsModal'
import SelectField from '../components/SelectField'
import { paddles as paddleData } from '../data/paddles'

function getBudgetLimit(budget) {
    if (budget === '₱3,000 or less') {
        return 3000
    }

    if (budget === '₱3,001 – ₱5,000') {
        return 5000
    }

    if (budget === '₱5,001 – ₱7,000') {
        return 7000
    }

    return 0
}

function getMatchScore(paddle, skillLevel, playingStyle, budget) {
    let score = 0

    if (
        paddle.recommendedFor &&
        paddle.recommendedFor.includes(skillLevel)
    ) {
        score += 40
    }

    if (
        paddle.styles &&
        paddle.styles.includes(playingStyle)
    ) {
        score += 35
    }

    if (paddle.price <= getBudgetLimit(budget)) {
        score += 25
    }

    return score
}

function PaddleMatch() {
    const [paddles] = useState(paddleData)
    const [skillLevel, setSkillLevel] = useState('')
    const [playingStyle, setPlayingStyle] = useState('')
    const [budget, setBudget] = useState('')
    const [recommendations, setRecommendations] = useState([])
    const [selectedPaddle, setSelectedPaddle] = useState(null)

    function handleSubmit(event) {
        event.preventDefault()

        const results = paddles
            .map((paddle) => ({
                ...paddle,
                matchScore: getMatchScore(
                    paddle,
                    skillLevel,
                    playingStyle,
                    budget
                ),
            }))
            .filter((paddle) => paddle.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)

        setRecommendations(results)
    }

    return (
        <main className="match-page">
            <section className="match-intro">
                <p className="eyebrow">PADDLE MATCH</p>

                <h1>Find Your Perfect Paddle</h1>

                <p>
                    Tell us about your game and we'll find paddle
                    options that match your preferences.
                </p>
            </section>

            <form
                className="preference-form"
                onSubmit={handleSubmit}
            >
                <SelectField
                    label="Skill Level"
                    value={skillLevel}
                    options={[
                        'Beginner',
                        'Recreational',
                        'Intermediate',
                    ]}
                    onChange={(event) =>
                        setSkillLevel(event.target.value)
                    }
                />

                <SelectField
                    label="Playing Style"
                    value={playingStyle}
                    options={[
                        'Control',
                        'Balanced',
                        'Power',
                    ]}
                    onChange={(event) =>
                        setPlayingStyle(event.target.value)
                    }
                />

                <SelectField
                    label="Budget"
                    value={budget}
                    options={[
                        '₱3,000 or less',
                        '₱3,001 – ₱5,000',
                        '₱5,001 – ₱7,000',
                    ]}
                    onChange={(event) =>
                        setBudget(event.target.value)
                    }
                />

                <button
                    type="submit"
                    className="primary-button"
                >
                    Find Match
                </button>
            </form>

            {recommendations.length > 0 && (
                <section className="recommendations">
                    <h2>Recommended Paddles</h2>

                    <div className="paddle-grid">
                        {recommendations.map((paddle) => (
                            <PaddleCard
                                key={paddle.id}
                                paddle={paddle}
                                onViewDetails={setSelectedPaddle}
                            />
                        ))}
                    </div>
                </section>
            )}

            {recommendations.length === 0 && (
                <p>
                    Choose your preferences and click Find Match.
                </p>
            )}

            <PaddleDetailsModal
                paddle={selectedPaddle}
                onClose={() => setSelectedPaddle(null)}
            />
        </main>
    )
}

export default PaddleMatch