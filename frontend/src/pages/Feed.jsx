import { useState } from "react";
import PostsList from "../components/PostsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts_all"); // State to track the active tab

  return (
    <div className="secondary text-primary p-6">
      {/* Page Title and Tabs */}
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Feed</h1>
          {/* Tabs for All and Following */}
          <div className="flex space-x-4 text-xs sm:text-base">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "posts_all"
                  ? "neutral text-primary"
                  : "primary text-gray-400"
              } hover:base-100`}
              onClick={() => setActiveTab("posts_all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "posts_following"
                  ? "neutral text-primary"
                  : "primary text-gray-400"
              } hover:base-100`}
              onClick={() => setActiveTab("posts_following")}
            >
              For You
            </button>
            <div className="border-l border-gray-700 mx-4 my-2"></div>
            <button
              onClick={() => navigate("/submit-post")}
              className={`px-4 py-2 rounded-lg primary`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Post
            </button>
          </div>
        </div>

        {/* Post Content */}
        <PostsList sourceId={null} type={activeTab} />
      </div>
    </div>
  );
};

export default FeedPage;
