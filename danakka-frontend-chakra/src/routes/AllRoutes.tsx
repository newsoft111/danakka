import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginView from '../pages/Authentication/Login';
import BookingFishingList from '../pages/Booking/Fishing/List';

const AllRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      	<Routes>
		  	<Route path="/" element={<Navigate replace to="/booking/live/"/>} />
	  		<Route path="/booking/live/" element={<BookingFishingList/>} />
		  	<Route path="/auth/login/" element={<LoginView/>} />
			<Route element={<BookingFishingList/>} />
      	</Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;