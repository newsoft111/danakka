import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider,Box } from '@chakra-ui/react';
import Header from './components/Layout/Header';
import AllRoutes from './routes/AllRoutes';
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
		<Box w='100%'>
			<Header />
			<Box p={4}>
				<AllRoutes/>
			</Box>
		</Box>
    </ChakraProvider>
  </React.StrictMode>,
);

reportWebVitals();