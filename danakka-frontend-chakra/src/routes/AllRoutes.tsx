import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginView from '../pages/Authentication/Login';
import BookingFishingList from '../pages/Booking/Fishing/List';
import BookingFishingDetail from '../pages/Booking/Fishing/Detail';

const AllRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      	<Routes>
		  	<Route path="/" element={<Navigate replace to="/booking/fishing/"/>} />
	  		<Route path="/booking/fishing/" element={<BookingFishingList/>} />
			<Route path="/booking/fishing/:no" element={<BookingFishingDetail/>} />
		  	<Route path="/auth/login/" element={<LoginView/>} />
      	</Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;