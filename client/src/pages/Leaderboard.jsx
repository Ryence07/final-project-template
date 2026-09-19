import { useEffect, useState } from 'react'

function Leaderboard() {
    const [players, setPlayers] = useState([])
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
                setError('Unable to load leaderboard.')
            } finally {
                setLoading(false)
            }
        }

        fetchPlayers()
    }, [])

    return (
        <main className="leaderboard-page">
            <section className="page-heading">
                <p className="eyebrow">LEADERBOARD</p>

                <h1>Player Leaderboard</h1>

                <p>
                    See the current player standings based on points.
                </p>
            </section>

            {loading && <p>Loading leaderboard...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (
                <section className="leaderboard">

                    {/* Desktop Leaderboard */}
                    <div className="leaderboard-desktop">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Skill Level</th>
                                    <th>Wins</th>
                                    <th>Points</th>
                                </tr>
                            </thead>

                            <tbody>
                                {players.map((player, index) => (
                                    <tr key={player.id}>
                                        <td>{index + 1}</td>
                                        <td>{player.name}</td>
                                        <td>{player.skillLevel}</td>
                                        <td>{player.wins}</td>
                                        <td>{player.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Leaderboard */}
                    <div className="leaderboard-mobile">
                        {players.map((player, index) => (
                            <article
                                className="leaderboard-mobile-card"
                                key={player.id}
                            >
                                <div className="leaderboard-rank">
                                    #{index + 1}
                                </div>

                                <div className="leaderboard-player">
                                    <strong>{player.name}</strong>

                                    <span>
                                        {player.skillLevel}
                                    </span>

                                    <span>
                                        Wins: {player.wins}
                                    </span>
                                </div>

                                <div className="leaderboard-points">
                                    <span>Points</span>
                                    <strong>{player.points}</strong>
                                </div>
                            </article>
                        ))}
                    </div>

                </section>
            )}
        </main>
    )
}

export default Leaderboard
