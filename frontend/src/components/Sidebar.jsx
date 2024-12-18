import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/solid";
import { createContext, useContext, useState } from "react";

// Create a context for the sidebar
export const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [visible, setVisible] = useState(false); // State to control visibility

  return (
    <SidebarContext.Provider value={{ expanded, setVisible, visible }}>
      {visible && ( // Render sidebar only if visible
        <aside className="h-screen">
          <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            {/* Sidebar content here */}

            <div className="p-4 pb-2 flex justify-between items-center">
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                className={`overflow-hidden transition-all ${
                  expanded ? "w-32" : "w-0"
                }`}
              />

              <button
                onClick={() => setExpanded((curr) => !curr)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                {expanded ? (
                  <ChevronLeftIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <ul className="flex-1 px-3">{children}</ul>

            {/* Footer or additional sidebar content */}
          </nav>
        </aside>
      )}
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
