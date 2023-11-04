// react
import React, { useEffect, useState } from 'react';

// third-party
import { Link, useNavigate } from 'react-router-dom';

// icons
import Download2LineIcon from '@/icons/Download2LineIcon';
import ArrowRightUpLineIcon from '@/icons/ArrowRightUpLineIcon';
import Delete2LineIcon from '@/icons/Delete2LineIcon';

// general
import { urlFor, client } from '@/client';

// types
import { IGoogleUserInfo } from '@/types/google';
import { IPinModel } from '@/types/pin';

// utils
import { fetchUser } from '@/utils/fetch-user';
// ----------------------------------------------------------------------

interface IProps {
  pin: IPinModel;
  className?: string;
}

const Pin: React.FC<IProps> = ({ pin, className }) => {
  // props
  const { postedBy, image, _id, destination, save } = pin;

  // variables
  const navigate = useNavigate();

  // state
  const [postHovered, setPostHovered] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IGoogleUserInfo>();
  const [alreadySaved, setAlreadySaved] = useState<boolean>();

  // lifecycle
  useEffect(() => {
    setUserInfo(fetchUser());
  }, []);

  useEffect(() => {
    setAlreadySaved(
      !!save?.find((item) => item.postedBy._id === userInfo?._id)
    );
  }, [save, userInfo]);

  // functions
  const savePin = (id: IPinModel['_id']) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: crypto.randomUUID(),
            userId: userInfo?._id,
            postedBy: {
              _type: 'postedBy',
              _ref: userInfo?._id,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id: IPinModel['_id']) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  // render
  return (
    <div className={`m-2 ${className}`}>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigate(`/pin-detail/${_id}`);
        }}
        tabIndex={0}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user post"
          src={urlFor(image).width(250).url()}
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <Download2LineIcon />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <ArrowRightUpLineIcon />
                  {destination &&
                    ((): string => {
                      const domain = destination.replace(/^\w+:\/\//, '');

                      return domain.length > 15
                        ? `${domain.slice(0, 15)}...`
                        : domain;
                    })()}
                </a>
              )}
              {postedBy?._id === userInfo?._id && (
                <button
                  type="button"
                  className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <Delete2LineIcon />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${userInfo?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          src={postedBy?.image}
          alt="user profile"
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
