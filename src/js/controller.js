import * as model from './model';
import recipeView from './views/recipeView';
import SearchView from './views/SearchView';
import resultsView from './views/resultsView';
import Pagination from './views/paginationView';
import 'core-js/actual';
import 'regenerator-runtime/runtime';
import BookmarkView from './views/bookMarkView';
import bookMarkView from './views/bookMarkView';
import addRecipeView from './views/addRecipeView';
import { Render_time_Sec } from './config';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // render spinner
    recipeView.renderSpinner();

    // loading data
    await model.loadRecipe(id);

    // update resultsview to mark selected element
    resultsView.update(model.getSearchResultPage());

    //update BookMarksView
    BookmarkView.update(model.state.bookMarks);

    // render data recipe
    recipeView.render(model.state.recipe);

    recipeView.showRecipe();

  } catch (err) {
    recipeView.handleError();
  }
};

const controlSearchResults = async function () {
  try {
    // get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // render spinner
    resultsView.renderSpinner();

    // loading data
    await model.loadSearchResults(query);

    // render results
    resultsView.render(model.getSearchResultPage());

    // render pagination
    Pagination.render(model.state.search);
  } catch (err) {
    resultsView.handleError();
  }
};
const controlPagination = function (btnId) {
  // render new  results
  resultsView.render(model.getSearchResultPage(btnId));

  // render pagination
  Pagination.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in model.state)
  model.updateServings(newServings);
  // render the new data in recipeView
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // Add/Remove BookMark
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);
  // Update bookMark
  recipeView.update(model.state.recipe);

  // render bookMark Recipe
  BookmarkView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  model.getLocalStorage();
  BookmarkView.render(model.state.bookMarks);
};

const controlUpload = async function (recipeData) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipeData(recipeData);

    recipeView.render(model.state.recipe);
    window.history.pushState(null, '' , `#${model.state.recipe.id}`)
    addRecipeView.renderMessage();
    setTimeout(function () {
      addRecipeView._handleModel();
      recipeView.showRecipe();
    }, Render_time_Sec);

  } catch (err) {
    addRecipeView.handleError(err.message);
  }
};

const init = function () {
  bookMarkView.addEventHandler(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  SearchView.addHandlerSearch(controlSearchResults);
  Pagination.addHandlerRender(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.handleUpload(controlUpload);
};
init();
