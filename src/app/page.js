// pages/index.js or app/page.js depending on your Next.js version
import React from 'react';
import Walkthrough from '@/Components/Walkthrough';
import ShoppingListPage from '@/Components/ShoppingListPage.js';
import { UserProvider } from '@/Contexts/UserContexts.js'; // Make sure this path is correct
import { ThemeProvider } from '@mui/material';

// import CssBaseline from '@mui/material';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <UserProvider>
       
     
          <Walkthrough />
         
      
      </UserProvider>
    </div>
  );
};

export default Home;
