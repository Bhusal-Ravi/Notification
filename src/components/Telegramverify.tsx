import { Copy, Check, ExternalLink, MessageSquare, Zap } from "lucide-react"
import { useState } from "react"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

function Telegramverify() {
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [copied, setCopied] = useState(false)

    async function getToken() {
        try {
            const base = API_BASE_URL ? `${API_BASE_URL}` : ''
            setToken("")
            setErrorMessage("")
            setLoading(true)
            const response = await fetch(`${base}/api/telegramverify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })

            const result = await response.json()
            if (!response.ok) {
                setErrorMessage(result.message)
            }

            setToken(result.data)

        } catch (error) {
            console.log(error)
            setErrorMessage('Failed to generate token. Please try again.')
        } finally {
            setLoading(false)
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        }
    }

    function handleTokenGenerate() {
        getToken()
    }

    function handleCopy() {
        navigator.clipboard.writeText(token)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <div className="min-h-screen w-full px-6 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                        Connect Your
                        <span className="inline-block bg-[#4ecdc4] px-3 py-1 ml-3 border-2 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
                            Telegram
                        </span>
                    </h1>
                    <p className="text-lg text-gray-700 font-medium">
                        Get instant notifications directly on Telegram
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_#000] p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#FFFF00] w-12 h-12 rounded-md border-2 border-black flex items-center justify-center font-black text-xl shrink-0">
                                1
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-2">Before You Start</h2>
                                <p className="text-base font-medium text-gray-700 mb-4">
                                    Make sure you have Telegram installed on your device (Windows/Android/iOS)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_#000] p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#ff6b6b] w-12 h-12 rounded-md border-2 border-black flex items-center justify-center font-black text-xl text-white shrink-0">
                                2
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-3">Open Our Telegram Bot</h2>
                                <p className="text-base font-medium text-gray-700 mb-4">
                                    Click the button below to open our bot in Telegram
                                </p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href='https://t.me/No_Ti_Fi_Ca_Ti_OnBot'
                                    className="inline-block"
                                >
                                    <div className="rounded-md bg-black w-fit">
                                        <span className="bg-[#4ecdc4] inline-flex items-center gap-2 rounded-md border-2 border-black px-5 py-3 font-bold text-sm -translate-x-1 -translate-y-1 transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0">
                                            <MessageSquare className="w-5 h-5" />
                                            Open Telegram Bot
                                            <ExternalLink className="w-4 h-4" />
                                        </span>
                                    </div>
                                </a>
                                <div className="mt-4 bg-gray-100 border-2 border-black rounded-md p-4">
                                    <p className="text-sm font-bold mb-2">In the bot chat:</p>
                                    <ul className="text-sm space-y-1 font-medium text-gray-700">
                                        <li>• Type <code className="bg-white px-2 py-1 border border-black rounded font-mono text-xs">/start</code> and press enter</li>
                                        <li>• You should receive a welcome message</li>
                                        <li>• This confirms the bot is working</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_#000] p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#c1ff72] w-12 h-12 rounded-md border-2 border-black flex items-center justify-center font-black text-xl shrink-0">
                                3
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-3">Generate Your Token</h2>
                                <p className="text-base font-medium text-gray-700 mb-4">
                                    Create a unique token to link your email with Telegram
                                </p>

                                {/* Token Display */}
                                {token && (
                                    <div className="mb-4 bg-[#FFFF00] border-4 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
                                        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Your Token</p>
                                        <div className="flex items-center gap-3">
                                            <code className="flex-1 bg-white border-2 border-black rounded px-4 py-3 font-mono font-bold text-lg break-all">
                                                {token}
                                            </code>
                                            <button
                                                onClick={handleCopy}
                                                className="rounded-md bg-black shrink-0"
                                            >
                                                <span className="bg-white inline-flex items-center gap-2 rounded-md border-2 border-black px-4 py-3 font-bold text-sm -translate-x-1 -translate-y-1 transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0">
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-5 h-5" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-5 h-5" />
                                                            Copy
                                                        </>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                        <p className="text-xs font-semibold mt-3 text-gray-700">
                                            💡 Copy & Paste this token to the bot <code className="bg-white px-2 py-1 border border-black rounded font-mono">/link [token] [yourmail@gmail.com]</code>
                                        </p>
                                    </div>
                                )}

                                {/* Loading State */}
                                {loading && (
                                    <div className="mb-4 bg-blue-100 border-2 border-black rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-5 h-5 animate-pulse" />
                                            <p className="font-bold text-sm">Generating your token... please wait</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error State */}
                                {errorMessage && (
                                    <div className="mb-4 bg-[#ffb5bd] border-2 border-black rounded-lg p-4">
                                        <p className="font-bold text-sm text-gray-900">{errorMessage}</p>
                                    </div>
                                )}

                                {/* Generate Button */}
                                <button
                                    disabled={loading}
                                    onClick={handleTokenGenerate}
                                    className="rounded-md bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="bg-[#c1ff72] inline-flex items-center gap-2 rounded-md border-2 border-black px-6 py-3 font-bold -translate-x-1 -translate-y-1 transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0 disabled:translate-x-0 disabled:translate-y-0">
                                        <Zap className="w-5 h-5" />
                                        {loading ? 'Generating...' : 'Generate Token'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-3 text-gray-600">Need Help?</h3>
                    <p className="text-sm font-medium text-gray-700">
                        If you're having trouble connecting, make sure you've completed all steps in order. The bot must receive your token within a few minutes of generation.
                    </p>
                </div>
            </div>
        </div>
  )
}

export default Telegramverify