import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginView from '../pages/Authentication/Login';
import BookingFishingList from '../pages/Booking/Fishing/List';

const AllRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      	<Routes>
	  		<Route path="/booking/live/" element={<BookingFishingList/>} />
		  	<Route path="/auth/login/" element={<LoginView/>} />
      	</Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;