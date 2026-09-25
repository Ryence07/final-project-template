import { useEffect, useState } from 'react'

import {
    acceptMatch,
    getCurrentPlayer,
    listMatches,
    listPlayers,
    logout,
    recordMatchResult,
    sendMatchRequest,
} from '../api'

import PlayerCard from '../components/PlayerCard'

function PlayerMatch() {
    const [currentPlayer, setCurrentPlayer] =
        useState(null)

    const [players, setPlayers] = useState([])
    const [matches, setMatches] = useState([])

    const [skillLevel, setSkillLevel] =
        useState('')

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const [requestStatuses, setRequestStatuses] =
        useState({})

    const [processingMatch, setProcessingMatch] =
        useState(null)

    async function loadData() {
        try {
            const [
                player,
                playerData,
                matchData,
            ] = await Promise.all([
                getCurrentPlayer(),
                listPlayers(),
                listMatches(),
            ])

            setCurrentPlayer(player)
            setPlayers(playerData)
            setMatches(matchData)

            const statuses = {}

            matchData.forEach((match) => {
                if (
                    match.requester_id === player.id &&
                    (
                        match.status === 'pending' ||
                        match.status === 'accepted'
                    )
                ) {
                    statuses[match.opponent_id] =
                        'sent'
                }
            })

            setRequestStatuses(statuses)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    async function handleMatchUp(opponentId) {
        setError('')

        if (
            requestStatuses[opponentId] ===
            'sent'
        ) {
            return
        }

        setRequestStatuses(
            (previous) => ({
                ...previous,
                [opponentId]: 'sending',
            })
        )

        try {
            await sendMatchRequest(
                opponentId
            )

            setRequestStatuses(
                (previous) => ({
                    ...previous,
                    [opponentId]: 'sent',
                })
            )

            await loadData()
        } catch (error) {
            if (
                error.message ===
                'A match request already exists'
            ) {
                setRequestStatuses(
                    (previous) => ({
                        ...previous,
                        [opponentId]: 'sent',
                    })
                )

                return
            }

            setRequestStatuses(
                (previous) => ({
                    ...previous,
                    [opponentId]: 'error',
                })
            )

            setError(error.message)
        }
    }

    async function handleAccept(matchId) {
        setError('')
        setProcessingMatch(matchId)

        try {
            await acceptMatch(matchId)
            await loadData()
        } catch (error) {
            setError(error.message)
        } finally {
            setProcessingMatch(null)
        }
    }

    async function handleWinner(
        matchId,
        winnerId
    ) {
        setError('')
        setProcessingMatch(matchId)

        try {
            await recordMatchResult(
                matchId,
                winnerId
            )

            await loadData()
        } catch (error) {
            setError(error.message)
        } finally {
            setProcessingMatch(null)
        }
    }

    async function handleLogout() {
        await logout()
        window.location.href = '/login'
    }

    const filteredPlayers =
        players.filter((player) => {
            if (
                player.id ===
                currentPlayer?.id
            ) {
                return false
            }

            if (!skillLevel) {
                return true
            }

            return (
                player.skillLevel ===
                skillLevel
            )
        })

    const incomingRequests =
        matches.filter(
            (match) =>
                match.opponent_id ===
                    currentPlayer?.id &&
                match.status === 'pending'
        )

    const acceptedMatches =
        matches.filter(
            (match) =>
                (
                    match.requester_id ===
                        currentPlayer?.id ||
                    match.opponent_id ===
                        currentPlayer?.id
                ) &&
                match.status === 'accepted'
        )

    if (loading) {
        return (
            <main className="player-page">
                <section className="page-heading">
                    <p className="eyebrow">
                        PLAYER MATCH
                    </p>

                    <h1>
                        Find Players to Play With
                    </h1>

                    <p>
                        Loading players...
                    </p>
                </section>
            </main>
        )
    }

    return (
        <main className="player-page">

            <section className="page-heading">
                <p className="eyebrow">
                    PLAYER MATCH
                </p>

                <h1>
                    Find Players to Play With
                </h1>

                <p>
                    Find players based on their
                    skill level and availability.
                </p>

                {currentPlayer && (
                    <div className="current-player-bar">
                        <span>
                            Logged in as{' '}
                            <strong>
                                {currentPlayer.name}
                            </strong>
                        </span>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}
            </section>


            {/* INCOMING REQUESTS */}

            {incomingRequests.length > 0 && (
                <section className="match-section">
                    <h2>
                        Match Requests
                    </h2>

                    {incomingRequests.map(
                        (match) => (
                            <article
                                className="match-request-card"
                                key={match.id}
                            >
                                <div>
                                    <h3>
                                        {
                                            match.requester_name
                                        }
                                    </h3>

                                    <p>
                                        wants to play
                                        with you.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        handleAccept(
                                            match.id
                                        )
                                    }
                                    disabled={
                                        processingMatch ===
                                        match.id
                                    }
                                >
                                    {processingMatch ===
                                    match.id
                                        ? 'Accepting...'
                                        : 'Accept'}
                                </button>
                            </article>
                        )
                    )}
                </section>
            )}


            {/* ACCEPTED MATCHES */}

            {acceptedMatches.length > 0 && (
                <section className="match-section">
                    <h2>
                        Record Match Result
                    </h2>

                    {acceptedMatches.map(
                        (match) => (
                            <article
                                className="match-request-card"
                                key={match.id}
                            >
                                <div>
                                    <h3>
                                        {
                                            match.requester_name
                                        }{' '}
                                        vs{' '}
                                        {
                                            match.opponent_name
                                        }
                                    </h3>

                                    <p>
                                        Who won the
                                        match?
                                    </p>
                                </div>

                                <div className="winner-buttons">
                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() =>
                                            handleWinner(
                                                match.id,
                                                match.requester_id
                                            )
                                        }
                                        disabled={
                                            processingMatch ===
                                            match.id
                                        }
                                    >
                                        {
                                            match.requester_name
                                        }{' '}
                                        Won
                                    </button>

                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() =>
                                            handleWinner(
                                                match.id,
                                                match.opponent_id
                                            )
                                        }
                                        disabled={
                                            processingMatch ===
                                            match.id
                                        }
                                    >
                                        {
                                            match.opponent_name
                                        }{' '}
                                        Won
                                    </button>
                                </div>
                            </article>
                        )
                    )}
                </section>
            )}


            {/* PLAYER FILTER */}

            <section className="player-filter">
                <label>
                    Skill Level

                    <select
                        value={skillLevel}
                        onChange={(event) =>
                            setSkillLevel(
                                event.target.value
                            )
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


            {/* PLAYER LIST */}

            <section className="player-list">
                {filteredPlayers.map(
                    (player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            onMatchUp={
                                handleMatchUp
                            }
                            requestStatus={
                                requestStatuses[
                                    player.id
                                ]
                            }
                        />
                    )
                )}
            </section>

        </main>
    )
}

export default PlayerMatch