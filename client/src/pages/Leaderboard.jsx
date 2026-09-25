import { useEffect, useState } from 'react'
import { listPlayers } from '../api'

function Leaderboard() {
    const [players, setPlayers] = useState([])
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

    const sortedPlayers = [...players].sort(
        (a, b) => b.points - a.points
    )

    if (loading) {
        return (
            <main className="leaderboard-page">
                <section className="page-heading">
                    <p className="eyebrow">LEADERBOARD</p>
                    <h1>Player Leaderboard</h1>
                    <p>Loading leaderboard...</p>
                </section>
            </main>
        )
    }

    if (error) {
        return (
            <main className="leaderboard-page">
                <section className="page-heading">
                    <p className="eyebrow">LEADERBOARD</p>
                    <h1>Player Leaderboard</h1>
                    <p>
                        Unable to load leaderboard: {error}
                    </p>
                </section>
            </main>
        )
    }

    return (
        <main className="leaderboard-page">
            <section className="page-heading">
                <p className="eyebrow">LEADERBOARD</p>

                <h1>Player Leaderboard</h1>

                <p>
                    See the current player standings based on points.
                </p>
            </section>

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
                            {sortedPlayers.map((player, index) => (
                                <tr key={player.id}>
                                    <td>
                                        {index + 1}
                                    </td>

                                    <td>
                                        {player.name}
                                    </td>

                                    <td>
                                        {player.skillLevel}
                                    </td>

                                    <td>
                                        {player.wins}
                                    </td>

                                    <td>
                                        {player.points}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Leaderboard */}
                <div className="leaderboard-mobile">
                    {sortedPlayers.map((player, index) => (
                        <article
                            className="leaderboard-mobile-card"
                            key={player.id}
                        >
                            <div className="leaderboard-rank">
                                #{index + 1}
                            </div>

                            <div className="leaderboard-player">
                                <strong>
                                    {player.name}
                                </strong>

                                <span>
                                    {player.skillLevel}
                                </span>

                                <span>
                                    Wins: {player.wins}
                                </span>
                            </div>

                            <div className="leaderboard-points">
                                <span>Points</span>

                                <strong>
                                    {player.points}
                                </strong>
                            </div>
                        </article>
                    ))}
                </div>

            </section>
        </main>
    )
}

export default Leaderboard