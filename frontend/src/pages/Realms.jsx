import { useState } from "react";
import RealmsList from "../components/RealmsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Realms = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <div className="secondary text-primary p-6">
      {/* Page Title and Tabs */}
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Groups</h1>
          {/* Tabs for All, Joined, and Created */}
          <div className="flex space-x-4 text-xs sm:text-base">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === "all"
                  ? "neutral text-primary"
                  : "primary text-gray-400"
              } hover:base-100`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedTab("joined")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === "joined"
                  ? "neutral text-primary"
                  : "primary text-gray-400"
              } hover:base-100`}
            >
              Joined
            </button>
            <button
              onClick={() => setSelectedTab("created")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === "created"
                  ? "neutral text-primary"
                  : "primary text-gray-400"
              } hover:base-100`}
            >
              Created
            </button>
            <div className="border-l border-gray-700 mx-4 my-2"></div>
            <button
              onClick={() => navigate("/submit-realm")}
              className={`px-4 py-2 rounded-lg primary`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Group
            </button>
          </div>
        </div>

        {/* Realms Content */}
        <RealmsList type={selectedTab} />
      </div>
    </div>
  );
};

export default Realms;
