import {Routes,Route, Navigate} from 'react-router-dom'
import Login from './Pages/Login'
import Restaurant from './Pages/Restaurant'
import Register from './Pages/Register'
import RestaurantDetails from './Pages/RestaurantDetails'
import MyBookings from './Pages/MyBookings'
import AddRestaurant from './Pages/AddRestaurant'
import MyRestaurants from './Pages/MyRestaurants'
import RestaurantBookings from './Pages/RestaurantBookings'
import AddTable from './Pages/AddTable'
import EditRestaurant from './Pages/EditRestaurant'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'

function App() {
  const token = localStorage.getItem('token');
  return (
    <Routes>
      <Route path='/' element={token ? <Navigate to='/restaurant'/> : <Login/>}/>
      <Route path='/register' element={token ? <Navigate to='/restaurant'/> : <Register/>}/>
      <Route path='/restaurant' element={<ProtectedRoute><Restaurant/></ProtectedRoute>}/>
      <Route path='/restaurant/:id' element={<ProtectedRoute><RestaurantDetails/></ProtectedRoute>}/>
      <Route path='/mybookings' element={<ProtectedRoute><MyBookings/></ProtectedRoute>}/>
      <Route path='/restaurants/add' element={<ProtectedRoute><AddRestaurant/></ProtectedRoute>}/>
      <Route path='/myrestaurants' element={<ProtectedRoute><MyRestaurants/></ProtectedRoute>}/>
      <Route path='/myrestaurants/:id/bookings' element={<ProtectedRoute><RestaurantBookings/></ProtectedRoute>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/myrestaurants/:id/addtable' element={<ProtectedRoute><AddTable/></ProtectedRoute>}/>
      <Route path='/myrestaurants/:id/edit' element={<ProtectedRoute><EditRestaurant/></ProtectedRoute>}/>
    </Routes>
  )
}

export default App
