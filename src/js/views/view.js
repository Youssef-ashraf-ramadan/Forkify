import icons from 'url:../../img/icons.svg';
export class View {
  _data;
  /**
   * Render the received object to the dom
   * @param {Object | Object[]} data // the data to be rendered (e.g.recipe)
   * @param {*} [render = true] // if false create markup string instead of rendering to the dom
   * @returns {undefined} a markup string is returned if render = false 
   * @this {Object} View object
   */
  render(data, render = true) {
    if (!data || data.length === 0) return this.handleError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._ParentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._ParentEl.innerHTML = '';
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._ParentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  handleError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>
             ${message}</p>
          </div>
    `;
    this._clear();
    this._ParentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>
             ${message}</p>
          </div>
    `;
    this._clear();
    this._ParentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._clear();
    this._ParentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
