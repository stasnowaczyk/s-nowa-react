import { Grid, Box, Typography, Link, Card, CardContent, Button, CardActions } from '@mui/material';

const Item = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                padding: 2,
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
            }}
        >
            {children}
        </Box>
    );
};

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                        Word of the Day
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        Hello World
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                                    <Typography variant="body2">
                                        well meaning and kindly.
                                        <br />
                                        {'"a benevolent smile"'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid size={4}>
                            <Item>size=4</Item>
                        </Grid>
                        <Grid size={4}>
                            <Item>size=4</Item>
                        </Grid>
                        <Grid size={8}>
                            <Item>size=8</Item>
                        </Grid>
                    </Grid>
                </Box>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <Box sx={{ textAlign: 'center', padding: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        Designed by{' '}
                        <Link
                            href="https://github.com/stasnowaczyk"
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                        >
                            Stas Nowaczyk
                        </Link>
                    </Typography>
                </Box>
            </footer>
        </div>
    );
}
