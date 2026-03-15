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
    Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
    const [isLoading, setIsLoading] = useState(true);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [callDuration, setCallDuration] = useState(0);

    const sessionRef = useRef(null);
    const publisherRef = useRef(null);
    const publisherContainerRef = useRef(null);
    const subscriberContainerRef = useRef(null);
    const timerRef = useRef(null);
    const router = useRouter();

    const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

    // Format seconds to MM:SS
    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Start call timer when connected
    useEffect(() => {
        if (isConnected) {
            timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isConnected]);

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
                if (subscriberContainerRef.current) {
                    sessionRef.current.subscribe(
                        event.stream,
                        subscriberContainerRef.current,
                        { insertMode: "append", width: "100%", height: "100%" },
                        (error) => {
                            if (error) toast.error("Error connecting to other participant's stream");
                        }
                    );
                }
            });

            sessionRef.current.on("sessionConnected", () => {
                setIsConnected(true);
                setIsLoading(false);
                if (publisherContainerRef.current) {
                    publisherRef.current = window.OT.initPublisher(
                        publisherContainerRef.current,
                        {
                            insertMode: "replace",
                            width: "100%",
                            height: "100%",
                            publishAudio: isAudioEnabled,
                            publishVideo: isVideoEnabled,
                        },
                        (error) => {
                            if (error) toast.error("Error initializing your camera and microphone");
                        }
                    );
                }
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
        } catch {
            toast.error("Failed to initialize video call");
            setIsLoading(false);
        }
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
        if (publisherRef.current) { publisherRef.current.destroy(); publisherRef.current = null; }
        if (sessionRef.current) { sessionRef.current.disconnect(); sessionRef.current = null; }
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
            <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <VideoOff className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-3">Invalid Video Call</h1>
                    <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
                        Missing required parameters. Please return to your appointments and try again.
                    </p>
                    <button
                        onClick={() => router.push("/appointments")}
                        className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                    >
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Script
                src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
                onLoad={handleScriptLoad}
                onError={() => { toast.error("Failed to load video call script"); setIsLoading(false); }}
            />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .vc-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080d0b;
          display: flex;
          flex-direction: column;
        }

        /* Top bar */
        .vc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,16,13,0.95);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .vc-logo {
          font-size: 15px;
          font-weight: 600;
          color: #34d399;
          letter-spacing: -0.3px;
        }
        .vc-logo span { color: rgba(255,255,255,0.5); font-weight: 300; }
        .vc-status-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 500;
          transition: all 0.3s;
        }
        .vc-status-pill.connecting {
          background: rgba(234,179,8,0.1);
          border: 1px solid rgba(234,179,8,0.25);
          color: #fbbf24;
        }
        .vc-status-pill.connected {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          color: #34d399;
        }
        .vc-status-pill.failed {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }
        .vc-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .vc-dot.pulse { animation: pulse-dot 1.4s ease-in-out infinite; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .vc-timer {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          font-variant-numeric: tabular-nums;
        }

        /* Main layout */
        .vc-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px 24px 0;
          gap: 20px;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
        }

        /* Video grid */
        .vc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) { .vc-grid { grid-template-columns: 1fr; } }

        .vc-video-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #0e1512;
          border: 1px solid rgba(255,255,255,0.06);
          aspect-ratio: 4/3;
        }
        .vc-video-card video-feed {
          width: 100%; height: 100%;
        }
        .vc-video-inner {
          width: 100%;
          height: 100%;
        }
        .vc-placeholder {
          width: 100%; height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .vc-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #064e3b, #065f46);
          border: 2px solid rgba(52,211,153,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vc-placeholder-label {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          font-weight: 400;
        }

        /* Card label badge */
        .vc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 11.5px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          z-index: 2;
        }

        /* Video muted indicator */
        .vc-muted-overlay {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(239,68,68,0.85);
          border-radius: 8px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: white;
          font-weight: 500;
          z-index: 2;
          backdrop-filter: blur(4px);
        }

        /* Loading state */
        .vc-loading {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 60px 20px;
        }
        .vc-loading-ring {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 2px solid rgba(52,211,153,0.15);
          border-top-color: #34d399;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .vc-loading-text {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
        }

        /* Controls bar */
        .vc-controls-wrap {
          padding: 20px 24px 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .vc-ctrl-btn {
          width: 52px; height: 52px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.18s ease;
          color: rgba(255,255,255,0.75);
          outline: none;
        }
        .vc-ctrl-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-1px);
        }
        .vc-ctrl-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .vc-ctrl-btn.off {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.25);
          color: #f87171;
        }
        .vc-ctrl-btn.off:hover:not(:disabled) {
          background: rgba(239,68,68,0.2);
        }
        .vc-ctrl-btn.end {
          background: #dc2626;
          border-color: #dc2626;
          color: white;
          width: 58px; height: 58px;
          border-radius: 16px;
        }
        .vc-ctrl-btn.end:hover {
          background: #b91c1c;
          border-color: #b91c1c;
          transform: translateY(-1px);
        }
        .vc-ctrl-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          text-align: center;
          padding-bottom: 8px;
        }
        .vc-ctrl-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .vc-ctrl-label {
          font-size: 10.5px;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
          letter-spacing: 0.3px;
        }
      `}</style>

            <div className="vc-root">
                {/* Top bar */}
                <div className="vc-topbar">
                    <div className="vc-logo">
                        MediConsult <span>/ Video</span>
                    </div>

                    <div className={`vc-status-pill ${isConnected ? "connected" : isLoading ? "connecting" : "failed"}`}>
                        <div className={`vc-dot ${isLoading && !isConnected ? "pulse" : ""}`} />
                        {isConnected ? "Live" : isLoading ? "Connecting" : "Disconnected"}
                    </div>

                    <div className="vc-timer">
                        <Clock size={13} />
                        {formatDuration(callDuration)}
                    </div>
                </div>

                {/* Body */}
                <div className="vc-body">
                    {isLoading && !scriptLoaded ? (
                        <div className="vc-loading">
                            <div className="vc-loading-ring" />
                            <p className="vc-loading-text">Preparing your consultation…</p>
                        </div>
                    ) : (
                        <div className="vc-grid">
                            {/* Publisher */}
                            <div className="vc-video-card">
                                <span className="vc-badge">You</span>
                                {!isVideoEnabled && (
                                    <div className="vc-muted-overlay">
                                        <VideoOff size={10} /> Camera off
                                    </div>
                                )}
                                <div ref={publisherContainerRef} className="vc-video-inner">
                                    {!scriptLoaded && (
                                        <div className="vc-placeholder">
                                            <div className="vc-avatar">
                                                <User size={26} color="#34d399" />
                                            </div>
                                            <span className="vc-placeholder-label">Waiting for camera…</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Subscriber */}
                            <div className="vc-video-card">
                                <span className="vc-badge">Participant</span>
                                <div ref={subscriberContainerRef} className="vc-video-inner">
                                    {(!isConnected || !scriptLoaded) && (
                                        <div className="vc-placeholder">
                                            <div className="vc-avatar">
                                                <User size={26} color="#34d399" />
                                            </div>
                                            <span className="vc-placeholder-label">
                                                {isConnected ? "Waiting for participant…" : "Not yet connected"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                {(!isLoading || scriptLoaded) && (
                    <div className="vc-controls-wrap">
                        <div className="vc-ctrl-group">
                            <button
                                className={`vc-ctrl-btn ${!isVideoEnabled ? "off" : ""}`}
                                onClick={toggleVideo}
                                disabled={!publisherRef.current}
                                title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                            >
                                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>
                            <span className="vc-ctrl-label">{isVideoEnabled ? "Camera" : "Off"}</span>
                        </div>

                        <div className="vc-ctrl-group">
                            <button
                                className={`vc-ctrl-btn ${!isAudioEnabled ? "off" : ""}`}
                                onClick={toggleAudio}
                                disabled={!publisherRef.current}
                                title={isAudioEnabled ? "Mute" : "Unmute"}
                            >
                                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>
                            <span className="vc-ctrl-label">{isAudioEnabled ? "Mic" : "Muted"}</span>
                        </div>

                        <div className="vc-ctrl-group">
                            <button
                                className="vc-ctrl-btn end"
                                onClick={endCall}
                                title="End call"
                            >
                                <PhoneOff size={22} />
                            </button>
                            <span className="vc-ctrl-label">End</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}