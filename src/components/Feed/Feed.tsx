import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '@/client';
import MasonryLayout from '@/components/MasonryLayout';
import Spinner from '@/components/Spinner';
import { feedQuery, searchQuery } from '@/utils/data';
import { IPinModel } from '@/types/pin';

const Feed = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<IPinModel[]>();
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client
        .fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } else {
      client
        .fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!pins?.length) return <h2>No Pins available</h2>;

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
