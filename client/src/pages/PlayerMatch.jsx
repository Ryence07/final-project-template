import { useEffect, useState } from 'react'
import { listPlayers } from '../api'
import PlayerCard from '../components/PlayerCard'

function PlayerMatch() {
    const [players, setPlayers] = useState([])
    const [skillLevel, setSkillLevel] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadPlayers() {
            try {
                const data = await listPlayers()
                setPlayers(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadPlayers()
    }, [])

    const filteredPlayers = players.filter((player) => {
        if (!skillLevel) {
            return true
        }

        return player.skillLevel === skillLevel
    })

    if (loading) {
        return (
            <main className="player-page">
                <section className="page-heading">
                    <p className="eyebrow">PLAYER MATCH</p>
                    <h1>Find Players to Play With</h1>
                    <p>Loading players...</p>
                </section>
            </main>
        )
    }

    if (error) {
        return (
            <main className="player-page">
                <section className="page-heading">
                    <p className="eyebrow">PLAYER MATCH</p>
                    <h1>Find Players to Play With</h1>
                    <p>Unable to load players: {error}</p>
                </section>
            </main>
        )
    }

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
                        <option value="">
                            All Skill Levels
                        </option>

                        <option value="Beginner">
                            Beginner
                        </option>

                        <option value="Recreational">
                            Recreational
                        </option>

                        <option value="Intermediate">
                            Intermediate
                        </option>
                    </select>
                </label>
            </section>

            <section className="player-list">
                {filteredPlayers.map((player) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                    />
                ))}
            </section>
        </main>
    )
}

export default PlayerMatch