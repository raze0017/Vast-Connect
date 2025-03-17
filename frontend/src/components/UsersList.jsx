import UserPreview from './UserPreview';
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { PuffLoader } from 'react-spinners';
import { useOutletContext } from 'react-router-dom'; 

const UsersList = ({ sourceId, scenario }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if there are more posts to load
  const limit = 10; // Number of posts per page

  const { scrollableRef } = useOutletContext();

  const resetUsers = useCallback(() => {
    // Clear posts when sourceId or type changes
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    resetUsers();
    
  }, [sourceId, scenario, resetUsers]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let response;
        switch (scenario) {
          case 'likedPost':
            response = await api.get(`/posts/${sourceId}/liked`, { params: { page, limit } });
            break;
          case 'likedComment':
            response = await api.get(`/comments/${sourceId}/liked`, { params: { page, limit } });
            break;
          case 'joinedRealm':
            response = await api.get(`/realms/${sourceId}/joiners`, { params: { page, limit } });
            break;
          case 'followers':
            response = await api.get(`/users/${sourceId}/followers`, { params: { page, limit } });
            break;
          case 'following':
            response = await api.get(`/users/${sourceId}/following`, { params: { page, limit } });
            break;
          default:
            response = { data: { users: [] } };
            break;
        }

        if (response.data.users.length < limit) {
          setHasMore(false); // No more users to load
        }

        setUsers(prevUsers => [...prevUsers, ...response.data.users]); // Append new users
      } 
      catch (error) {
        console.error('Error fetching users:', error);
      } 
      finally {
          setLoading(false);
      }
    };
    fetchUsers();
  }, [page, scenario, sourceId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        scrollableRef.current &&
        scrollableRef.current.scrollTop + scrollableRef.current.clientHeight >=
          scrollableRef.current.scrollHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollableRef, hasMore, loading]);

  return (
    <div className="user-list space-y-4">
      {users.length > 0 
      ?
      users.map((user) => (
        <UserPreview 
          key={user.id} 
          user={user}
          userId={user.id} 
          users={users}
          setUsers={setUsers}
        />
      ))
      :
      !loading && <p className="text-gray-600 text-center mt-8">No users available.</p>
    }
      {loading && 
        <div className="flex justify-center items-center h-full">
          <PuffLoader color="#5C6BC0" size={60} />
        </div>
      }
    </div>
  );
};

export default UsersList;
