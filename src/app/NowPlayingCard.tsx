'use client';

import { Card, CardContent, CardMedia, LinearProgress, Button, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faUser, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!nowPlaying?.item) return <Typography>No track currently playing</Typography>;

    const progressPercentage = (nowPlaying.progress_ms / nowPlaying.item.duration_ms) * 100;

    return (
        <Card sx={{ height: '100%' }}>
            <CardMedia
                component="img"
                height="200"
                image={nowPlaying.item.album.images[0].url}
                alt={`${nowPlaying.item.name} album cover`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5">
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
                    sx={{ height: 6, borderRadius: 3, mb: 2 }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    href={nowPlaying.item.external_urls.spotify}
                    target="_blank"
                    startIcon={<FontAwesomeIcon icon={faSpotify} />}
                    sx={{
                        backgroundColor: '#1DB954',
                        '&:hover': { backgroundColor: '#1ED760' },
                    }}
                >
                    Play on Spotify
                </Button>
            </CardContent>
        </Card>
    );
}
