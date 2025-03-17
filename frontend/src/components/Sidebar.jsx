import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // Import GitHub icon
import api from "../services/api";
import { PuffLoader } from "react-spinners";

const Sidebar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { sidebarUser: loggedUser, loading } = useUser();
  const [suggestedRealms, setSuggestedRealms] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const take = 4;

  useEffect(() => {
    const fetchSuggestedData = async () => {
      try {
        const response = await api.get(`/users/${userId}/suggest`, {
          params: { take },
        });
        setSuggestedUsers(response.data.users);
        setSuggestedRealms(response.data.realms);
        setSuggestedLoading(false);
      } catch (error) {
        console.error("Error fetching suggested details", error);
      }
    };
    if (loggedUser.id) {
      fetchSuggestedData();
    }
  }, [userId, loggedUser.id]);

  const handleUserNavigate = (e, id) => {
    e.stopPropagation();
    navigate(`/profile/${id}`);
  };

  const handleRealmNavigate = (e, id) => {
    e.stopPropagation();
    navigate(`/realms/${id}`);
  };

  return (
    <nav className="hidden lg:flex bg-gray-900 text-white flex-col h-full py-6 px-4 border-l border-gray-700">
      {loading || suggestedLoading ? (
        <div className="flex justify-center items-center h-full w-[230px]">
          <PuffLoader color="#5C6BC0" size={60} />
        </div>
      ) : (
        <>
          {/* Logged User Profile Container */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            <img
              src={loggedUser?.profilePictureUrl}
              alt={`${loggedUser?.username}'s profile`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold hover:underline">
                @{loggedUser?.username}
              </h2>
              <p className="text-xs text-gray-400 truncate overflow-hidden whitespace-nowrap max-w-36">
                {loggedUser?.bio}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>

          {/* Suggested */}
          <div className="mb-4 flex-1 overflow-y-scroll">
            <div className="font-bold text-gray-300 mb-4">
              Suggested for you
            </div>

            {/* Suggested Users */}
            <div className="mb-2">
              <h3 className="text-sm text-gray-300 font-semibold mb-2">
                Users
              </h3>
              {suggestedUsers.length > 0 ? (
                suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 mb-2 rounded-lg hover:bg-gray-800 hover:shadow-md transition-all cursor-pointer group"
                    onClick={(e) => handleUserNavigate(e, user.id)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user?.profilePictureUrl}
                        alt={`${user?.username}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                      />
                      <div>
                        <h4 className="text-md font-medium hover:underline overflow-hidden whitespace-nowrap max-w-36">
                          @{user?.username}
                        </h4>
                        <p className="text-xs text-gray-400 truncate overflow-hidden whitespace-nowrap max-w-36">
                          {user?.bio}
                        </p>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  Wow! You know all of our users.
                </p>
              )}
            </div>

            {/* Suggested Realms */}
            <div className="mb-2">
              <h3 className="text-sm text-gray-300 font-semibold mb-2">
                Realms
              </h3>
              {suggestedRealms.length > 0 ? (
                suggestedRealms.map((realm) => (
                  <div
                    key={realm.id}
                    className="flex items-center justify-between p-2 mb-2 rounded-lg hover:bg-gray-800 hover:shadow-md transition-all cursor-pointer group"
                    onClick={(e) => handleRealmNavigate(e, realm.id)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={realm?.realmPictureUrl}
                        alt={`${realm?.name} realm`}
                        className="w-10 h-10 rounded-lg object-cover border-2 border-gray-600"
                      />
                      <div>
                        <h4 className="text-md font-medium hover:underline truncate overflow-hidden whitespace-nowrap max-w-36">
                          {realm?.name}
                        </h4>
                        <p className="text-xs text-gray-400 truncate overflow-hidden whitespace-nowrap max-w-36">
                          {realm?.description}
                        </p>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-gray-400 text-sm">
                    You joined all our realms!
                  </p>
                  <p
                    className="text-indigo-500 text-sm cursor-pointer hover:underline"
                    onClick={() => navigate("/submit-realm")}
                  >
                    Create a new one here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>

          {/* Footer */}
          <div className="text-xs text-gray-500 flex flex-col items-center space-y-2">
            <a
              href="https://github.com/HarryAhnHS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faGithub} className="text-lg mr-1" />
              Developed by &nbsp;
              <span>
                Group 10- Vidya Academy <br /> Of Science and Technology
              </span>
            </a>
            <span>PERN Stack Project</span>
          </div>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
