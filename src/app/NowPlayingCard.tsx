'use client';

import { Card, CardContent, CardMedia, LinearProgress, Button, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faUser, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';

interface NowPlayingData {
    is_playing: boolean;
    progress_ms: number;
    item?: {
        name: string;
        artists: string[];
        album: {
            name: string;
            images: { url: string }[];
        };
        external_urls: {
            spotify: string;
        };
        duration_ms: number;
    };
}

export default function NowPlayingCard() {
    const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    const wsRef = useRef<WebSocket | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(false);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const connectWebSocket = () => {
        if (!isMounted.current) return;

        // Clear any existing connection
        if (wsRef.current) {
            // wsRef.current.close();
        }

        const ws = new WebSocket('ws://localhost:8000/spotify/ws/now-playing');
        wsRef.current = ws;

        // Setup heartbeat
        heartbeatRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 25000); // Send ping every 25 seconds

        ws.onopen = () => {
            if (!isMounted.current) return;
            console.log('WebSocket connected');
            setConnectionStatus('connected');
            setLoading(false);
            setError(null);

            // Clear any polling when WS connects
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            if (!isMounted.current) return;

            console.log('event', event);
            // Handle non-JSON messages like "ping" or "pong"
            if (event.data === 'ping' || event.data === 'pong') {
                return;
            }

            try {
                const data = JSON.parse(event.data);
                setNowPlaying(data);
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
            if (!isMounted.current) return;
            setConnectionStatus('error');
            setError('WebSocket connection error');
            scheduleReconnect();
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
            if (!isMounted.current) return;
            setConnectionStatus('disconnected');
            scheduleReconnect();
        };
    };

    const scheduleReconnect = () => {
        if (!isMounted.current) return;
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
        }
        retryTimeoutRef.current = setTimeout(() => {
            if (isMounted.current) {
                console.log('Attempting WebSocket reconnection...');
                connectWebSocket();
            }
        }, 3000); // Retry every 3 seconds
    };

    const startPolling = () => {
        if (pollingIntervalRef.current) return;

        const fetchNowPlaying = async () => {
            try {
                const response = await fetch('http://localhost:8000/spotify/now-playing');
                if (!response.ok) throw new Error('Failed to fetch now playing');
                const data = await response.json();
                setNowPlaying(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setNowPlaying(null);
            } finally {
                setLoading(false);
            }
        };

        fetchNowPlaying(); // Initial fetch
        pollingIntervalRef.current = setInterval(fetchNowPlaying, 5000);
    };

    useEffect(() => {
        isMounted.current = true;
        connectWebSocket();

        return () => {
            isMounted.current = false;

            // Cleanup all intervals and connections
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // Start polling if WebSocket fails
    useEffect(() => {
        if (connectionStatus === 'error' && !pollingIntervalRef.current) {
            startPolling();
        }
    }, [connectionStatus]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!nowPlaying?.item) return <Typography>No track currently playing</Typography>;

    const progressPercentage = (nowPlaying.progress_ms / nowPlaying.item.duration_ms) * 100;

    return (
        <Card
            sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' },
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={nowPlaying.item.album.images[0].url}
                alt={`${nowPlaying.item.name} album cover`}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {nowPlaying.item.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FontAwesomeIcon icon={faUser} />
                    <Typography variant="body2" color="text.secondary">
                        {nowPlaying.item.artists.join(', ')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FontAwesomeIcon icon={faCompactDisc} />
                    <Typography variant="body2" color="text.secondary">
                        {nowPlaying.item.album.name}
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        mb: 2,
                        '& .MuiLinearProgress-bar': {
                            transition: 'transform 0.5s linear',
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    href={nowPlaying.item.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<FontAwesomeIcon icon={faSpotify} />}
                    sx={{
                        backgroundColor: '#1DB954',
                        '&:hover': {
                            backgroundColor: '#1ED760',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Play on Spotify
                </Button>

                {connectionStatus !== 'connected' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {connectionStatus === 'connecting' ? 'Connecting...' : 'Using polling updates'}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
