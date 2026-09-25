import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api'

function Login() {
    const navigate = useNavigate()

    const [mode, setMode] = useState('login')

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [skillLevel, setSkillLevel] =
        useState('Beginner')

    const [playingStyle, setPlayingStyle] =
        useState('Balanced')

    const [availability, setAvailability] =
        useState('Weekends')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function switchMode(newMode) {
        setMode(newMode)
        setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setLoading(true)

        try {
            if (mode === 'login') {
                await login(username, password)

                navigate('/players')
                return
            }

            await register({
                name,
                username,
                password,
                skillLevel,
                playingStyle,
                availability,
            })

            // Automatically log the user in
            // after successful registration.
            await login(username, password)

            navigate('/players')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const isSignup = mode === 'signup'

    return (
        <main className="login-page">
            <section className="login-card">

                <p className="eyebrow">
                    PADDLEMATCH
                </p>

                <h1>
                    {isSignup
                        ? 'Create Account'
                        : 'Welcome Back'}
                </h1>

                <p className="login-description">
                    {isSignup
                        ? 'Create your player profile and start finding people to play with.'
                        : 'Log in to find players, send match requests, and track your results.'}
                </p>

                <form onSubmit={handleSubmit}>

                    {isSignup && (
                        <label>
                            Full Name

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Your full name"
                                required
                            />
                        </label>
                    )}

                    <label>
                        Username

                        <input
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            placeholder="Choose a username"
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder={
                                isSignup
                                    ? 'At least 8 characters'
                                    : 'Your password'
                            }
                            autoComplete={
                                isSignup
                                    ? 'new-password'
                                    : 'current-password'
                            }
                            required
                        />
                    </label>

                    {isSignup && (
                        <>
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

                            <label>
                                Playing Style

                                <select
                                    value={playingStyle}
                                    onChange={(event) =>
                                        setPlayingStyle(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="Balanced">
                                        Balanced
                                    </option>

                                    <option value="Control">
                                        Control
                                    </option>

                                    <option value="Power">
                                        Power
                                    </option>
                                </select>
                            </label>

                            <label>
                                Availability

                                <select
                                    value={availability}
                                    onChange={(event) =>
                                        setAvailability(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="Weekends">
                                        Weekends
                                    </option>

                                    <option value="Weekday Evenings">
                                        Weekday Evenings
                                    </option>

                                    <option value="Friday Evenings">
                                        Friday Evenings
                                    </option>

                                    <option value="Saturday">
                                        Saturday
                                    </option>
                                </select>
                            </label>
                        </>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? isSignup
                                ? 'Creating Account...'
                                : 'Logging in...'
                            : isSignup
                                ? 'Create Account'
                                : 'Log In'}
                    </button>

                </form>

                <div className="auth-switch">
                    {isSignup ? (
                        <>
                            Already have an account?

                            <button
                                type="button"
                                onClick={() =>
                                    switchMode('login')
                                }
                            >
                                Log In
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?

                            <button
                                type="button"
                                onClick={() =>
                                    switchMode('signup')
                                }
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

            </section>
        </main>
    )
}

export default Login