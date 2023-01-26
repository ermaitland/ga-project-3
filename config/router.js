import express from 'express';
import brandController from '../controllers/brandController.js';
import secureRoute from '../middleware/secureRoute.js';
import productsController from '../controllers/productsController.js';
import UserController from '../controllers/UserController.js';
import reviewsController from '../controllers/reviewsController.js';
import categoriesController from '../controllers/categoriesController.js';

const Router = express.Router();

Router.route('/products')
  .get(productsController.getAllProducts)
  .post(secureRoute, productsController.createNewProduct);

Router.route('/products/filter').get(productsController.getFilteredProducts);

Router.route('/products/search').get(productsController.searchProducts);

Router.route('/products/:id')
  .get(productsController.getSingleProduct)
  .put(secureRoute, productsController.updateSingleProduct)
  .delete(secureRoute, productsController.deleteSingleProduct);

Router.route('/products/:id/reviews').post(
  secureRoute,
  reviewsController.createReview
);

Router.route('/products/:id/reviews/:reviewId')
  .put(secureRoute, reviewsController.updateReview)
  .delete(secureRoute, reviewsController.deleteReview);

Router.route('/categories')
  .get(categoriesController.getAllCategories)
  .post(secureRoute, categoriesController.createNewCategory);

Router.route('/categories/:id').delete(
  secureRoute,
  categoriesController.deleteCategory
);

Router.route('/categories/:id/products').get(
  categoriesController.getAllProductsForCategory
);

Router.route('/brands')
  .get(brandController.getAllBrands)
  .post(secureRoute, brandController.createNewBrand);

Router.route('/brands/:id')
  .delete(secureRoute, brandController.deleteBrand)
  .get(brandController.getAllProductsForBrand);

Router.route('/brands/:id/products').get(
  brandController.getAllProductsForBrand
);

Router.route('/profile/:userId').post(
  secureRoute,
  UserController.singleUserProfile
);

Router.route('/users').get(UserController.getAllUsers);

Router.route('/register').post(UserController.registerUser);

Router.route('/login').post(UserController.loginUser);

export default Router;
