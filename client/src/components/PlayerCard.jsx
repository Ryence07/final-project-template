function PlayerCard({
    player,
    onMatchUp,
    requestStatus,
}) {
    const initial =
        player.name.charAt(0).toUpperCase()

    return (
        <article className="player-card">
            <div className="player-avatar">
                {initial}
            </div>

            <div className="player-info">
                <h3>{player.name}</h3>

                <p>
                    {player.skillLevel} ·{' '}
                    {player.playingStyle}
                </p>

                <p>
                    Available: {player.availability}
                </p>
            </div>

            <div className="player-record">
                <strong>{player.wins}W</strong>
                <span>{player.losses}L</span>
            </div>

            <button
                type="button"
                className="card-button primary-button"
                onClick={() =>
                    onMatchUp(player.id)
                }
                disabled={
                    requestStatus === 'sending' ||
                    requestStatus === 'sent'
                }
            >
                {requestStatus === 'sending'
                    ? 'Sending...'
                    : requestStatus === 'sent'
                        ? 'Request Sent'
                        : 'Match Up'}
            </button>
        </article>
    )
}

export default PlayerCard