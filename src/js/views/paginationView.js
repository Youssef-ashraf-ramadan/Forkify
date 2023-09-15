import icons from 'url:../../img/icons.svg';
import { View } from './view';

class Pagination extends View {
  _ParentEl = document.querySelector('.pagination');
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    if (this._data.currentPage === 1 && numPages > 1) {
      return this._generateMarkupButtons('next');
    }

    if (this._data.currentPage < numPages) {
      return [
        this._generateMarkupButtons('next'),
        this._generateMarkupButtons('prev'),
      ].join('');
    }
    if (this._data.currentPage === numPages && numPages > 1) {
      return this._generateMarkupButtons('prev');
    }
    return '';
  }
  _generateMarkupButtons(type) {
    const next = this._data.currentPage + 1;
    const prev = this._data.currentPage - 1;

    return `<button class="btn--inline pagination__btn--${type}" data-id="${
      type === 'next' ? next : prev
    }">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
    </svg>
    <span> Page ${type === 'next' ? next : prev}</span>
  </button>`;
  }
  addHandlerRender(handler) {
    this._ParentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const btnId = +btn.dataset.id;
      handler(btnId);
    });
  }
}

export default new Pagination();
