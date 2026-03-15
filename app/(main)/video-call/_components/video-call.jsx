"use client"

import React from 'react'

const VideoCall = ({ sessionId, token }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [scriptLoaded, setScriptLoaded] = React.useState(false);
    const [isConnected, setIsConnected] = React.useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);


    const handleScriptLoad = () => {
        setScriptLoaded(true);
        if (!window.OT) { //ot means opentok object is available
            toast("Failed to load vonage video API");
            setIsLoading(false);
            return;
        }



    }


    return (
        <>
            <Script
                src="https://unpkg.com/@videojs/vjs-media-session@latest/dist/index.min.js"
                onLoad={handleScriptLoad}
                onError={() => {
                    toast("Failed to load video.js media session");
                    setIsLoading(false);
                }}
            />

        </>
    )
}

export default VideoCall