import {
  Routes,
  Route,
} from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import CarDetail from "./pages/CarDetail";

// Admin Components & Auth Guard
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import InventoryManager from "./pages/admin/InventoryManager";
import AddEditCar from "./pages/admin/AddEditCar";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public Routes inheriting PublicLayout */}
      <Route
        element={
          <PublicLayout />
        }
      >
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/inventory"
          element={
            <Inventory />
          }
        />
        <Route
          path="/car/:id"
          element={
            <CarDetail />
          }
        />
      </Route>

      {/* Unprotected Admin Login Route */}
      <Route
        path="/admin/login"
        element={
          <Login />
        }
      />

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        >
          <Route
            index
            element={
              <Dashboard />
            }
          />
          <Route
            path="inventory"
            element={
              <InventoryManager />
            }
          />
          <Route
            path="add-car"
            element={
              <AddEditCar />
            }
          />
          <Route
            path="edit-car/:id"
            element={
              <AddEditCar />
            }
          />
          <Route
            path="settings"
            element={
              <Settings />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
