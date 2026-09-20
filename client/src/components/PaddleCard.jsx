function PaddleCard({ paddle, onViewDetails }) {
    return (
        <article className="paddle-card">
            <div className="paddle-image">
                <span>Paddle Image</span>
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