// app.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Layout/Navbar';
import AllRoutes from './routes/AllRoutes';

const App: React.FC = () => {
  return (
      <Box minHeight="100vh" bg="gray.100">
        <Navbar />
        <Box p={4}>
          <AllRoutes />
        </Box>
      </Box>
  );
};

export default App;
