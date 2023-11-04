// react
import React, { useState, useEffect, useCallback } from 'react';

// types
import { IUserModel } from '@/types/user';
import { IPinDetailModel, IPinModel } from '@/types/pin';

// third party
import { Link, useParams } from 'react-router-dom';

// general
import { client, urlFor } from '@/client';

// components
import MasonryLayout from '@/components/MasonryLayout';
import Spinner from '@/components/Spinner';

// utils
import { pinDetailMorePinQuery, pinDetailQuery } from '@/utils/data';

// icons
import Download2LineIcon from '@/icons/Download2LineIcon';
// -----------------------------------------------------------------------------

interface IProps {
  user?: IUserModel;
}

const PinDetail: React.FC<IProps> = ({ user }) => {
  // state
  const [pins, setPins] = useState<IPinModel[] | null>(null);
  const [pinDetail, setPinDetail] = useState<IPinDetailModel | null>(null);
  const [comment, setComment] = useState<string>('');
  const [addingComment, setAddingComment] = useState<boolean>(false);

  // variables
  const { pinId } = useParams();

  // functions
  const fetchPinDetail = useCallback(async () => {
    let query = pinDetailQuery(pinId!);

    if (query) {
      client.fetch(query).then(([data]) => {
        setPinDetail(data);

        if (data) {
          query = pinDetailMorePinQuery(data);
          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId!)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: crypto.randomUUID(),
            postedBy: {
              _type: 'postedBy',
              _ref: user?._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment('');
        })
        .catch((err) => console.log(err))
        .finally(() => setAddingComment(false));
    }
  };

  // lifecycle
  useEffect(() => {
    fetchPinDetail();
  }, [pinId, fetchPinDetail]);

  // render
  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: 1500, borderRadius: 32 }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <Download2LineIcon />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetail.postedBy?.image}
              alt="user profile"
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail.comments?.map((comment) => (
              <div
                key={comment.comment}
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
              >
                <img
                  src={comment.postedBy?.image}
                  alt="user profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
              <img
                src={pinDetail.postedBy?.image}
                alt="user profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                referrerPolicy="no-referrer"
              />
            </Link>
            <input
              type="text"
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {pins?.length ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
