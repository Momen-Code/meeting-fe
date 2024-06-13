import { QueryClient, QueryClientProvider } from "react-query";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { Loader } from "./components";
import {
  Splash,
  UserType,
  Login,
  AssistantDashboard,
  AdminDashboard,
} from "./pages";
import { useAuthContext } from "./provider";

//Styles
import "react-notifications/lib/notifications.css";
import "./assets/styles/_global.scss";
import { SocketProvider } from "./socket";

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn } = useAuthContext();
  return (
    <div className="app-container">
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <Router>
            <Loader />
            {isLoggedIn && (
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            )}
            {!isLoggedIn && (
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/user-type" element={<UserType />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/assistant-dashboard"
                  element={<AssistantDashboard />}
                />
                <Route path="*" element={<Navigate to="/user-type" />} />
                {/* 
              <Route path="/actions/:type" element={<Actions />} />
              <Route
                path="/:status/type-action/:type"
                element={<TypeAction />}
                />
                <Route path="/:status/barcode/:type" element={<Barcode />} />
                <Route path="/:type/registration" element={<Register />} />
                <Route path="/camera/:status" element={<Camera />} />
                */}
              </Routes>
            )}
          </Router>
        </SocketProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
