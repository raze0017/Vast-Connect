import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/UserContext';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { PuffLoader } from 'react-spinners';

const EditProfileModal = ({ open, handleModalClose, user, userId, setProfileMeta }) => {
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [fileError, setFileError] = useState('');
  const { updateSidebarUser } = useUser();


  const modalRef = useRef(null); // Ref for the modal container
  const isDemoUser = user?.username === 'demo'; // Check if the logged user is "demo"

  useEffect(() => {
    if (open && user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
      });
      setUsernameError('');
      setFileError('');
      setImagePreview(user.profilePictureUrl);
    }
  }, [open, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleModalClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, handleModalClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check for valid file type (only PNG, JPEG, GIF)
    if (file && !['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
      setFileError("Invalid file type - only PNG, JPEG, and GIF allowed.");
      setProfilePictureFile(user.profilePictureUrl);
      setImagePreview(null);
      return;
    }
    setFileError("");

    setProfilePictureFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (profilePictureFile) {
        const pictureData = new FormData();
        pictureData.append('profilePicture', profilePictureFile);
        await api.put('/images/profile-picture', pictureData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      const response = await api.put(`/users/${userId}`, formData);
      updateSidebarUser(response.data.user); // Update the user context with the new data
      setProfileMeta(response.data.user);
      handleModalClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response?.data?.errors) {
        setUsernameError(error.response.data.errors[0].msg);
      }
      if (error.response?.data?.error) {
        setUsernameError(error.response.data.error);
      }
      if (error.response?.data?.message === 'Invalid file type') {
        setFileError("Invalid file type - only PNG, JPEG, and GIF allowed.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null; // Don't render the modal if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-gray-800 text-white rounded-lg shadow-lg max-w-lg w-full p-6"
      >
        <h2 className="text-2xl mb-4">Update Your Profile</h2>
        <div className='border-t border-gray-700 my-6'></div>
        <form onSubmit={handleFormSubmit}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <PuffLoader color="#5C6BC0" size={60} />
            </div>
          ) : (
            <>
              <div className="relative mt-4 flex flex-col items-center justify-center">
                <div className='mb-1'>Change Profile Photo</div>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicture"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="profilePicture" className="relative cursor-pointer w-32 h-32">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-700"
                    />
                  )}
                  <div className="w-32 h-32 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <FontAwesomeIcon icon={faUpload} />
                  </div>
                </label>
                {fileError && <p className="text-center text-red-500 mt-2">{fileError}</p>}
              </div>
              <div className="mt-4">
                <label htmlFor='username'>Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder={isDemoUser ? "Feature locked for demo accounts" : "Username"}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isDemoUser} // Disable the input if user is "demo"
                  className={`w-full p-2 rounded bg-gray-800 border-2 ${
                    usernameError ? 'border-red-500' : 'border-gray-700'
                  } text-white ${isDemoUser ? 'cursor-not-allowed opacity-50' : ''}`} // Adjust styles when disabled
                />
                {usernameError && <p className="text-red-500">{usernameError}</p>}
              </div>
              <div className="mt-4">
                <label htmlFor='bio'>Bio&nbsp;<span className='text-sm'>(optional)</span></label>
                <textarea
                  id="bio"
                  placeholder="Bio (optional)"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 border-2 border-gray-700 text-white"
                ></textarea>
              </div>
            </>
          )}
        </form>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleModalClose}
            className="mr-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
