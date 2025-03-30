import { Grid, Box, Typography, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import NowPlayingCard from './NowPlayingCard';

const Item = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            padding: 2,
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            height: '100%',
        }}
    >
        {children}
    </Box>
);

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            <NowPlayingCard />
                        </Grid>
                        <Grid size={4}>
                            <Item>About Me</Item>
                        </Grid>
                        <Grid size={4}>
                            <Item>Projects</Item>
                        </Grid>
                        <Grid size={8}>
                            <Item>More Content</Item>
                        </Grid>
                    </Grid>
                </Box>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <Box sx={{ textAlign: 'center', padding: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Designed by</Typography>
                        <Link
                            href="https://github.com/stasnowaczyk"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <FontAwesomeIcon icon={faGithub} style={{ width: 14, height: 14 }} />
                            @stasnowaczyk
                        </Link>
                    </Box>
                </Box>
            </footer>
        </div>
    );
}
