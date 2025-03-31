// AuthenticatedLayout.js
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { useRef } from "react";

const AuthenticatedLayout = () => {
  const scrollableRef = useRef(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Navbar className="secondary text-primary flex-shrink-0 h-full" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col secondary text-primary transition-all duration-300">
        {/* Search Bar */}
        <div className="my-4 mx-6 text-primary">
          <SearchBar className="flex-1" />
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollableRef}
          className="secondary flex-1 rounded-lg overflow-y-auto"
        >
          <Outlet context={{ scrollableRef }} />
        </div>
      </div>

      <Sidebar />
    </div>
  );
};

export default AuthenticatedLayout;
