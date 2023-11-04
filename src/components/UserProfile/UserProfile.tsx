// react
import { useState, useEffect } from 'react';

// icons
import ExitLineIcon from '@/icons/ExitLineIcon';

// third-party
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

// utils
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '@/utils/data';

// general
import { client } from '@/client';

// components
import MasonryLayout from '@/components/MasonryLayout';
import Spinner from '@/components/Spinner';

// types
import { IUserModel } from '@/types/user';
import { IPinModel } from '@/types/pin';
// -----------------------------------------------------------------------------

const randomImageUrl =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  // state
  const [user, setUser] = useState<IUserModel | null>(null);
  const [pins, setPins] = useState<IPinModel[] | null>(null);
  const [text, setText] = useState<string>('Created');
  const [activeBtn, setActiveBtn] = useState<string>('created');

  // variables
  const navigate = useNavigate();
  const { userId } = useParams();

  // lyfecycle
  useEffect(() => {
    if (userId) {
      const query = userQuery(userId);
      client.fetch(query).then(([data]) => setUser(data));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      if (text === 'Created') {
        const createdPinsQuery = userCreatedPinsQuery(userId);
        client.fetch(createdPinsQuery).then((data) => setPins(data));
      } else {
        const savedPinsQuery = userSavedPinsQuery(userId);
        client.fetch(savedPinsQuery).then((data) => setPins(data));
      }
    }
  }, [text, userId]);

  // functions
  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login');
  };

  // render
  if (!user) return <Spinner message="Loading profile..." />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImageUrl}
              alt="banner pic"
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            />
            <img
              src={user.image}
              alt="user pic"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <button
                  type="button"
                  onClick={logout}
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md text-red-500"
                >
                  <ExitLineIcon size={21} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText((e.target as HTMLButtonElement).textContent ?? '');
                setActiveBtn('created');
              }}
              className={`${
                activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText((e.target as HTMLButtonElement).textContent ?? '');
                setActiveBtn('saved');
              }}
              className={`${
                activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          <div className="px-2">
            {pins?.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No Pins
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
