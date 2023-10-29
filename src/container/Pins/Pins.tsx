import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Feed from '@/components/Feed';
import PinDetail from '@/components/PinDetail';
import CreatePin from '@/components/CreatePin';
import Search from '@/components/Search';
import { IUserModel } from '@/types/user';

interface IProps {
  user?: IUserModel;
}

const Pins: React.FC<IProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetail user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
