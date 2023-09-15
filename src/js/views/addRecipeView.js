import { View } from './view';

class AddRecipeView extends View {
  _ParentEl = document.querySelector('.upload');
  _recipeWindow = document.querySelector('.add-recipe-window');
  _btnCloseModel = document.querySelector('.btn--close-modal');
  _btnOpenModel = document.querySelector('.nav__btn--add-recipe');
  _overlay = document.querySelector('.overlay');
  _successMessage = 'Recipe was successfully uploaded :)';

  constructor() {
    super();
    this._addHandlerShowModel();
    this._addHandlerCloseModel();
  }
  _handleModel() {
    this._recipeWindow.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShowModel() {
    this._btnOpenModel.addEventListener('click', this._handleModel.bind(this));
  }
  _addHandlerCloseModel() {
    this._btnCloseModel.addEventListener('click', this._handleModel.bind(this));
    this._overlay.addEventListener('click', this._handleModel.bind(this));
  }
  handleUpload(handler) {
    this._ParentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);

    });
  }
}
export default new AddRecipeView();
