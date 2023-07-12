import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookingFishingList from '../pages/Booking/Fishing/List';

const AllRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
	  	<Route path="/booking/live/" element={<BookingFishingList/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;