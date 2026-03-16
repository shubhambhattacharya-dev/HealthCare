"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    User,
    Wifi,
    WifiOff,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
    const [isLoading, setIsLoading] = useState(true);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [deviceError, setDeviceError] = useState(null);

    const sessionRef = useRef(null);
    const publisherRef = useRef(null);
    const timerRef = useRef(null);

    const router = useRouter();
    const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

    // Call duration timer
    useEffect(() => {
        if (isConnected) {
            timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isConnected]);

    const formatDuration = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    const handleScriptLoad = () => {
        setScriptLoaded(true);
        if (!window.OT) {
            toast.error("Failed to load Vonage Video API");
            setIsLoading(false);
            return;
        }
        initializeSession();
    };

    const initializeSession = () => {
        if (!appId || !sessionId || !token) {
            toast.error("Missing required video call parameters");
            router.push("/appointments");
            return;
        }

        try {
            sessionRef.current = window.OT.initSession(appId, sessionId);

            sessionRef.current.on("streamCreated", (event) => {
                sessionRef.current.subscribe(
                    event.stream,
                    "subscriber",
                    { insertMode: "append", width: "100%", height: "100%" },
                    (error) => {
                        if (error) toast.error("Error connecting to other participant's stream");
                    }
                );
            });

            sessionRef.current.on("sessionConnected", () => {
                setIsConnected(true);
                setIsLoading(false);

                publisherRef.current = window.OT.initPublisher(
                    "publisher",
                    {
                        insertMode: "replace",
                        width: "100%",
                        height: "100%",
                        publishAudio: isAudioEnabled,
                        publishVideo: isVideoEnabled,
                    },
                    (error) => {
                        if (error) {
                            if (error.code === 1500 || error.name === "OT_HARDWARE_UNAVAILABLE") {
                                setDeviceError("Camera or Microphone is currently being used by another application or tab. Please close other apps and try again.");
                            } else {
                                toast.error("Error initializing your camera and microphone");
                            }
                            setIsLoading(false);
                            setIsConnected(false);
                        }
                    }
                );
            });

            sessionRef.current.on("sessionDisconnected", () => setIsConnected(false));

            sessionRef.current.connect(token, (error) => {
                if (error) {
                    toast.error("Error connecting to video session");
                } else {
                    if (publisherRef.current) {
                        sessionRef.current.publish(publisherRef.current, (error) => {
                            if (error) toast.error("Error publishing your stream");
                        });
                    }
                }
            });
        } catch (error) {
            toast.error("Failed to initialize video call");
            setDeviceError("An unexpected error occurred during initialization.");
            setIsLoading(false);
        }
    };

    const retryCall = () => {
        setDeviceError(null);
        setIsLoading(true);
        initializeSession();
    };

    const joinAudioOnly = () => {
        setDeviceError(null);
        setIsVideoEnabled(false);
        setIsLoading(true);
        // We'll re-init the publisher with video: false
        if (publisherRef.current) {
            publisherRef.current.destroy();
        }
        
        publisherRef.current = window.OT.initPublisher(
            "publisher",
            {
                insertMode: "replace",
                width: "100%",
                height: "100%",
                publishAudio: isAudioEnabled,
                publishVideo: false,
            },
            (error) => {
                if (error) {
                    toast.error("Failed to join even with Audio Only");
                    setDeviceError("Hardware is completely inaccessible.");
                    setIsLoading(false);
                } else {
                    if (sessionRef.current && sessionRef.current.connected) {
                        sessionRef.current.publish(publisherRef.current, (err) => {
                            if (!err) {
                                setIsConnected(true);
                                setIsLoading(false);
                            }
                        });
                    }
                }
            }
        );
    };

    const toggleVideo = () => {
        if (publisherRef.current) {
            publisherRef.current.publishVideo(!isVideoEnabled);
            setIsVideoEnabled((prev) => !prev);
        }
    };

    const toggleAudio = () => {
        if (publisherRef.current) {
            publisherRef.current.publishAudio(!isAudioEnabled);
            setIsAudioEnabled((prev) => !prev);
        }
    };

    const endCall = () => {
        if (publisherRef.current) {
            publisherRef.current.destroy();
            publisherRef.current = null;
        }
        if (sessionRef.current) {
            sessionRef.current.disconnect();
            sessionRef.current = null;
        }
        router.push("/appointments");
    };

    useEffect(() => {
        return () => {
            if (publisherRef.current) publisherRef.current.destroy();
            if (sessionRef.current) sessionRef.current.disconnect();
        };
    }, []);

    if (!sessionId || !token || !appId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f0e]">
                <div className="text-center space-y-4 px-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <WifiOff className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">
                        Invalid Session
                    </h1>
                    <p className="text-[#6b7f7a] text-sm max-w-xs mx-auto">
                        Missing required parameters for this video call.
                    </p>
                    <button
                        onClick={() => router.push("/appointments")}
                        className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium transition-colors"
                    >
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

                * { box-sizing: border-box; }

                .vc-root {
                    min-height: 100vh;
                    background: #070c0b;
                    font-family: 'DM Sans', sans-serif;
                    display: flex;
                    flex-direction: column;
                    color: white;
                }

                /* Subtle grid overlay */
                .vc-root::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(16,185,129,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16,185,129,0.025) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none;
                    z-index: 0;
                }

                .vc-inner {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    max-width: 1100px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 28px 20px 24px;
                }

                /* ── Header ── */
                .vc-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                }
                .vc-title {
                    font-size: 1.05rem;
                    font-weight: 500;
                    letter-spacing: -0.01em;
                    color: #e2f0ec;
                }
                .vc-status-pill {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    padding: 5px 12px;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-family: 'DM Mono', monospace;
                    font-weight: 500;
                    letter-spacing: 0.03em;
                    border: 1px solid;
                    transition: all 0.3s ease;
                }
                .vc-status-pill.connected {
                    background: rgba(16,185,129,0.08);
                    border-color: rgba(16,185,129,0.25);
                    color: #34d399;
                }
                .vc-status-pill.connecting {
                    background: rgba(251,191,36,0.08);
                    border-color: rgba(251,191,36,0.2);
                    color: #fbbf24;
                }
                .vc-status-pill.failed {
                    background: rgba(239,68,68,0.08);
                    border-color: rgba(239,68,68,0.2);
                    color: #f87171;
                }
                .vc-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: currentColor;
                    flex-shrink: 0;
                }
                .vc-status-pill.connected .vc-dot {
                    animation: pulse-dot 2s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.35; }
                }

                .vc-timer {
                    font-family: 'DM Mono', monospace;
                    font-size: 0.78rem;
                    color: #4b7064;
                    letter-spacing: 0.06em;
                }

                /* ── Loading State ── */
                .vc-loading {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                }
                .vc-loading-ring {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: 2px solid rgba(16,185,129,0.12);
                    border-top-color: #10b981;
                    animation: spin 0.9s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .vc-loading p {
                    font-size: 0.875rem;
                    color: #4b7064;
                    font-weight: 400;
                }

                /* ── Video Grid ── */
                .vc-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    flex: 1;
                    margin-bottom: 20px;
                }
                @media (max-width: 640px) {
                    .vc-grid { grid-template-columns: 1fr; }
                }

                .vc-video-card {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #0e1715;
                    border: 1px solid rgba(255,255,255,0.05);
                    min-height: 300px;
                }
                @media (min-width: 768px) {
                    .vc-video-card { min-height: 380px; }
                }

                /* Thin accent line at top */
                .vc-video-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent);
                    z-index: 2;
                }

                .vc-card-label {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: 999px;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.06);
                    font-size: 0.7rem;
                    font-weight: 500;
                    color: #94a3b8;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .vc-card-label-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #10b981;
                }

                .vc-video-slot {
                    position: absolute;
                    inset: 0;
                }

                /* Placeholder when no video */
                .vc-placeholder {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                .vc-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: rgba(16,185,129,0.07);
                    border: 1px solid rgba(16,185,129,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .vc-avatar svg { color: #2d6e5e; }
                .vc-placeholder-text {
                    font-size: 0.75rem;
                    color: #2d4a43;
                    font-weight: 400;
                }

                /* ── Controls Bar ── */
                .vc-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 16px 20px;
                    background: rgba(14,23,21,0.8);
                    backdrop-filter: blur(16px);
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                    margin-bottom: 16px;
                }

                .vc-ctrl-btn {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.04);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #94a3b8;
                    position: relative;
                    flex-shrink: 0;
                }
                .vc-ctrl-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(255,255,255,0.18);
                    color: #e2e8f0;
                    transform: translateY(-1px);
                }
                .vc-ctrl-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .vc-ctrl-btn.active {
                    background: rgba(16,185,129,0.1);
                    border-color: rgba(16,185,129,0.3);
                    color: #34d399;
                }
                .vc-ctrl-btn.muted {
                    background: rgba(239,68,68,0.1);
                    border-color: rgba(239,68,68,0.25);
                    color: #f87171;
                }

                .vc-divider {
                    width: 1px;
                    height: 28px;
                    background: rgba(255,255,255,0.06);
                    margin: 0 4px;
                    flex-shrink: 0;
                }

                .vc-end-btn {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    background: #dc2626;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: white;
                    flex-shrink: 0;
                    box-shadow: 0 0 0 0 rgba(220,38,38,0.4);
                }
                .vc-end-btn:hover {
                    background: #b91c1c;
                    transform: scale(1.05);
                    box-shadow: 0 0 0 6px rgba(220,38,38,0.15);
                }
                .vc-end-btn:active { transform: scale(0.97); }

                /* ── Footer hint ── */
                .vc-footer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    flex-wrap: wrap;
                }
                .vc-hint {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.72rem;
                    color: #2d4a43;
                    font-weight: 400;
                }
                .vc-hint svg { width: 13px; height: 13px; }
                .vc-hint span.on { color: #2d6e5e; }
                .vc-hint span.off { color: #6b3535; }

                .vc-sep { color: #1a2e29; font-size: 0.72rem; }
            `}</style>

            <Script
                src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
                onLoad={handleScriptLoad}
                onError={() => {
                    toast.error("Failed to load video call script");
                    setIsLoading(false);
                }}
            />

            <div className="vc-root">
                <div className="vc-inner">

                    {/* Header */}
                    <div className="vc-header">
                        <span className="vc-title">Video Consultation</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {isConnected && (
                                <span className="vc-timer">{formatDuration(callDuration)}</span>
                            )}
                            <div className={`vc-status-pill ${isConnected ? "connected" : isLoading ? "connecting" : "failed"}`}>
                                <span className="vc-dot" />
                                {isConnected ? "Live" : isLoading ? "Connecting" : "Failed"}
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && !scriptLoaded ? (
                        <div className="vc-loading">
                            <div className="vc-loading-ring" />
                            <p>Initialising secure connection…</p>
                        </div>
                    ) : deviceError ? (
                        <div className="vc-loading">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <WifiOff className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Hardware Conflict</h2>
                            <p className="text-[#6b7f7a] text-center max-w-sm mb-6">
                                {deviceError}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={retryCall}
                                    className="px-6 py-2.5 rounded-full bg-[#1e2927] hover:bg-[#2a3835] text-white text-sm font-medium transition-colors border border-emerald-500/20"
                                >
                                    Retry Connection
                                </button>
                                <button
                                    onClick={joinAudioOnly}
                                    className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium transition-colors"
                                >
                                    Audio Only
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Video Grid */}
                            <div className="vc-grid">
                                {/* Publisher */}
                                <div className="vc-video-card">
                                    <div className="vc-card-label">
                                        <span className="vc-card-label-dot" />
                                        You
                                    </div>
                                    <div id="publisher" className="vc-video-slot">
                                        {!scriptLoaded && (
                                            <div className="vc-placeholder">
                                                <div className="vc-avatar">
                                                    <User size={28} />
                                                </div>
                                                <span className="vc-placeholder-text">Camera initialising</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subscriber */}
                                <div className="vc-video-card">
                                    <div className="vc-card-label">
                                        Participant
                                    </div>
                                    <div id="subscriber" className="vc-video-slot">
                                        {(!isConnected || !scriptLoaded) && (
                                            <div className="vc-placeholder">
                                                <div className="vc-avatar">
                                                    <User size={28} />
                                                </div>
                                                <span className="vc-placeholder-text">
                                                    {isConnected ? "Waiting for participant" : "Awaiting connection"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="vc-controls">
                                <button
                                    className={`vc-ctrl-btn ${isVideoEnabled ? "active" : "muted"}`}
                                    onClick={toggleVideo}
                                    disabled={!publisherRef.current}
                                    title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                                >
                                    {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                                </button>

                                <button
                                    className={`vc-ctrl-btn ${isAudioEnabled ? "active" : "muted"}`}
                                    onClick={toggleAudio}
                                    disabled={!publisherRef.current}
                                    title={isAudioEnabled ? "Mute" : "Unmute"}
                                >
                                    {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                                </button>

                                <div className="vc-divider" />

                                <button
                                    className="vc-end-btn"
                                    onClick={endCall}
                                    title="End call"
                                >
                                    <PhoneOff size={20} />
                                </button>
                            </div>

                            {/* Footer hints */}
                            <div className="vc-footer">
                                <span className="vc-hint">
                                    <Video size={13} />
                                    Camera{" "}
                                    <span className={isVideoEnabled ? "on" : "off"}>
                                        {isVideoEnabled ? "on" : "off"}
                                    </span>
                                </span>
                                <span className="vc-sep">·</span>
                                <span className="vc-hint">
                                    <Mic size={13} />
                                    Mic{" "}
                                    <span className={isAudioEnabled ? "on" : "off"}>
                                        {isAudioEnabled ? "on" : "off"}
                                    </span>
                                </span>
                                <span className="vc-sep">·</span>
                                <span className="vc-hint">
                                    Press the red button to end the consultation
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}