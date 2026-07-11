import express from 'express'
import  { addRestaurant, allRestaurantController,getRestaurant,getRestaurantBookings,restaurantControllerById,deleteRestaurant,updateRestaurant } from '../controllers/restaurantController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
import {addTable, getTable, deleteTable, updateTable, getAllTables} from '../controllers/tableController.js'
import  {isRestaurantOwner, isOwner } from '../middleware/isRestaurantOwner.js'

const router = express.Router()

router.route('/').get(allRestaurantController)
router.route('/').post(authenticateUser,isOwner,addRestaurant)
router.route('/myrestaurants').get(authenticateUser,isOwner,getRestaurant)
router.route('/myrestaurants/:id/bookings').get(authenticateUser,isOwner,getRestaurantBookings)
router.route('/:id').post(authenticateUser,addRestaurant)
router.route('/:id').get(restaurantControllerById)
router.route('/:id').delete(authenticateUser, deleteRestaurant)
router.route('/:id').put(authenticateUser, updateRestaurant)
router.route('/:id/table').post(authenticateUser,isRestaurantOwner,addTable)
router.route('/:id/table').get(authenticateUser,getTable)
router.route('/:id/tables').get(authenticateUser,getAllTables)
router.route('/:id/table/:tableId').delete(authenticateUser,isRestaurantOwner,deleteTable)
router.route('/:id/table/:tableId').put(authenticateUser,isRestaurantOwner,updateTable)

export default router;