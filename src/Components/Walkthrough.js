"use client"

import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const slides = [
  {
    title: 'Track Your Pantry',
    description: 'Easily keep track of what’s in your pantry and know when to restock.',
    image: '/10.jpg',
  },
  {
    title: 'Smart Grocery List',
    description: 'Create a smart grocery list based on your pantry inventory and upcoming needs.',
    image: '/2.jpg',
  },
  {
    title: 'Recipe Suggestions',
    description: 'Get recipe ideas based on the ingredients you have in your pantry.',
    image: '/1.jpg',
  },
];

const Walkthrough = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      window.location.href = '/auth_login'; // Redirect to signup page
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          {slides[currentSlide].title}
        </Typography>
        <Box
          sx={{
            mt: 2,
            mb: 4,
            textAlign: 'center',
          }}
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {slides[currentSlide].description}
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={nextSlide}
          sx={{ mt: 2 }}
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default Walkthrough;
