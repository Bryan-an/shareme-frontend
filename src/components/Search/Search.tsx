// react
import React, { useState, useEffect } from 'react';

// components
import MasonryLayout from '@/components/MasonryLayout';
import Spinner from '@/components/Spinner';

// general
import { client } from '@/client';

// utils
import { feedQuery, searchQuery } from '@/utils/data';

// types
import { IPinModel } from '@/types/pin';
// -----------------------------------------------------------------------------

interface IProps {
  searchTerm: string;
}

const Search: React.FC<IProps> = ({ searchTerm }) => {
  // states
  const [pins, setPins] = useState<IPinModel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      {pins?.length && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm && !loading && (
        <div className="mt-10 text-center text-xl">No Pins Found!</div>
      )}
    </div>
  );
};

export default Search;
