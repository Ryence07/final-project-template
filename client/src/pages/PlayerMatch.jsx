import { useState } from 'react'
import PlayerCard from '../components/PlayerCard'
import { players as playerData } from '../data/players'

function PlayerMatch() {
    const [players] = useState(playerData)
    const [skillLevel, setSkillLevel] = useState('')

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