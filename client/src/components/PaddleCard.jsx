const paddleImages = {
    1: `${import.meta.env.BASE_URL}images/paddles/paddle-slk-evo-control.png`,
    2: `${import.meta.env.BASE_URL}images/paddles/paddle-joola-essentials.png`,
    3: `${import.meta.env.BASE_URL}images/paddles/paddle-franklin-signature.png`,
    4: `${import.meta.env.BASE_URL}images/paddles/paddle-slk-halo-power.png`,
    5: `${import.meta.env.BASE_URL}images/paddles/paddle-hyperion.png`,
}

function PaddleCard({ paddle, onViewDetails }) {
    return (
        <article className="paddle-card">
            <div className="paddle-image">
                <img
                    src={paddleImages[paddle.id]}
                    alt={`${paddle.brand} ${paddle.model}`}
                />
            </div>

            <p className="paddle-brand">{paddle.brand}</p>

            <h3>{paddle.model}</h3>

            <p className="paddle-price">
                ₱{paddle.price.toLocaleString()}
            </p>

            <p className="paddle-description">
                {paddle.description}
            </p>

            <div className="match-score">
                {paddle.matchScore}% Match
            </div>

            <button
                className="primary-button card-button"
                onClick={() => onViewDetails(paddle)}
            >
                View Details
            </button>
        </article>
    )
}

export default PaddleCard