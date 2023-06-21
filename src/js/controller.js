import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC, UPDATE_FORM } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //Update recipes view
    resultsView.update(model.getSearchResultPage());

    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1).Loading Recipe
    await model.loadRecipe(id);

    // 2).Rendering Recipe
    recipeView.render(model.state.recipe);

    //TEST
    // controlServings();
  } catch (err) {
    recipeView.renderError(`${err}`);
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    //Get Search
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //Load Search
    await model.loadSearchResults(query);

    //Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //Render Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPgination = function (goToPage) {
  //Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  //Render NEW Pagination BUTTOM
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //succes message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      setTimeout(function () {
        addRecipeView._generateMarkup();
      }, UPDATE_FORM * 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// const controlDeleteRecipe = async function () {
//   console.log(model.deleteBookmark(model.state.recipe));
// };

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPgination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
