import previewView from './previewView';
import { View } from './view';
class ResultsView extends View {
  _ParentEl = document.querySelector('.results');
  _errorMessage = `No recipes found for your query.  Please try again!`;
  // _successMessage;
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
