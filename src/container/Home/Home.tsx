import { useState, useRef, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { client } from '@/client';
import { IGoogleUserInfo } from '@/types/google';
import { IUser } from '@/types/user';
import { userQuery } from '@/utils/data';
import logo from '@/assets/logo.png';
import Sidebar from '@/components/Sidebar';
import UserProfile from '@/components/UserProfile';
import Pins from '@/container/Pins';
import MenuFillIcon from '@/icons/MenuFillIcon';
import CloseCircleFillIcon from '@/icons/CloseCircleFillIcon';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const info = localStorage.getItem('user');

    if (info) {
      const userInfo: IGoogleUserInfo = JSON.parse(info);
      const query = userQuery(userInfo._id!);

      client
        .fetch(query)
        .then(([data]) => {
          setUser(data);
        })
        .catch((err) => console.log(err));
    } else {
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <button onClick={() => setToggleSidebar(true)}>
            <MenuFillIcon size={40} />
          </button>
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt={user?.userName} className="w-28" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <button onClick={() => setToggleSidebar(false)}>
                <CloseCircleFillIcon size={30} />
              </button>
            </div>
            <Sidebar user={user} setToggleSidebar={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
