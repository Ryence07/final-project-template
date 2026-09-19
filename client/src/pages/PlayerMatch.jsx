import { useEffect, useState } from 'react'
import PlayerCard from '../components/PlayerCard'

function PlayerMatch() {
    const [players, setPlayers] = useState([])
    const [skillLevel, setSkillLevel] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const response = await fetch(
                    'http://localhost:3000/api/players'
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch players')
                }

                const data = await response.json()

                setPlayers(data)
            } catch (error) {
                console.error(error)
                setError('Unable to load players.')
            } finally {
                setLoading(false)
            }
        }

        fetchPlayers()
    }, [])

    const filteredPlayers = players.filter((player) => {
        if (!skillLevel) {
            return true
        }

        return player.skillLevel === skillLevel
    })

    return (
        <main className="player-page">
            <section className="page-heading">
                <p className="eyebrow">PLAYER MATCH</p>

                <h1>Find Players to Play With</h1>

                <p>
                    Find players based on their skill level and
                    availability.
                </p>
            </section>

            <section className="player-filter">
                <label>
                    Skill Level

                    <select
                        value={skillLevel}
                        onChange={(event) =>
                            setSkillLevel(event.target.value)
                        }
                    >
                        <option value="">All Skill Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Recreational">
                            Recreational
                        </option>
                        <option value="Intermediate">
                            Intermediate
                        </option>
                    </select>
                </label>
            </section>

            {loading && <p>Loading players...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (
                <section className="player-list">
                    {filteredPlayers.map((player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                        />
                    ))}
                </section>
            )}
        </main>
    )
}

export default PlayerMatch
