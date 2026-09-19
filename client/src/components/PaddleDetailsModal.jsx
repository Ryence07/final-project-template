function PaddleDetailsModal({ paddle, onClose }) {
    if (!paddle) {
        return null
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="paddle-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close paddle details"
                >
                    ×
                </button>

                <div className="modal-image">
                    Paddle Image
                </div>

                <div className="modal-content">
                    <p className="eyebrow">{paddle.brand}</p>

                    <h2>{paddle.model}</h2>

                    <p className="modal-price">
                        ₱{paddle.price.toLocaleString()}
                    </p>

                    <div className="modal-match">
                        {paddle.matchScore}% Match
                    </div>

                    <p className="modal-description">
                        {paddle.description}
                    </p>

                    <h3>Specifications</h3>

                    <div className="specifications">
                        <div>
                            <span>Weight</span>
                            <strong>{paddle.weight}</strong>
                        </div>

                        <div>
                            <span>Shape</span>
                            <strong>{paddle.shape}</strong>
                        </div>

                        <div>
                            <span>Power</span>
                            <strong>{paddle.power}</strong>
                        </div>

                        <div>
                            <span>Control</span>
                            <strong>{paddle.control}</strong>
                        </div>

                        <div>
                            <span>Spin</span>
                            <strong>{paddle.spin}</strong>
                        </div>
                    </div>

                    <h3>Why This Paddle?</h3>

                    <p className="why-paddle">
                        This paddle was recommended based on your
                        selected skill level, playing style, and budget.
                    </p>

                    <button
                        className="primary-button modal-button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaddleDetailsModal
