"use client";

import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const slides = [
  {
    title: '',
    image: '/trackpantry.jpg',
  },
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
  const router = useRouter();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/auth_login'); // Redirect to signup page using Next.js router
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ backgroundColor: 'white', borderRadius: 2, padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          textAlign: 'center',
        }}
      >
        {slides[currentSlide].title && (
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
            {slides[currentSlide].title}
          </Typography>
        )}
        <Box
          sx={{
            mb: 4,
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '56.25%', // Aspect ratio 16:9
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: 'grey.100',
          }}
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        {slides[currentSlide].description && (
          <Typography variant="body1" sx={{ mb: 4 }}>
            {slides[currentSlide].description}
          </Typography>
        )}
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
