import { Api_Url } from './config';
import { AjaxApiData } from './helper';
import { Res_Per_Page, Api_Key } from './config';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: Res_Per_Page,
    currentPage: 1, // default value
  },
  bookMarks: [],
};
const createRecipeObject = function (data) {
  const {recipe} = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key : recipe.key}),
    price : 20
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AjaxApiData(`${Api_Url}/${id}?key=${Api_Key}`);
    state.recipe = createRecipeObject(data);
    if (state.bookMarks.some(bookmark => bookmark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AjaxApiData(`${Api_Url}?search=${query}&key=${Api_Key}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key : rec.key})
      };
    });
    state.search.currentPage = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.price = (state.recipe.price * newServings) / state.recipe.servings;
  state.recipe.servings = newServings;
};

const setLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

export const addBookMark = function (recipe) {
  // Add bookmark
  state.bookMarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  setLocalStorage();
};
export const removeBookMark = function (id) {
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookMarked = false;
  setLocalStorage();
};

export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem('bookmarks'));
  if (data) state.bookMarks = data;
};
export const uploadRecipeData = async function (Recipe) {
  try {
    const ingredients = Object.entries(Recipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingredientsArr = ing[1].split(',').map(el => el.trim());
        if (ingredientsArr.length !== 3)
          throw new Error(
            'Wrong Ingredients Format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingredientsArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const newRecipe = {
      title: Recipe.title,
      publisher: Recipe.publisher,
      source_url: Recipe.sourceUrl,
      image_url: Recipe.image,
      servings: +Recipe.servings,
      cooking_time: +Recipe.cookingTime,
      ingredients,
    };

    const data = await AjaxApiData(`${Api_Url}?key=${Api_Key}`, newRecipe);
    state.recipe = createRecipeObject(data);

  } catch (err) {
    throw err;
  }
};
