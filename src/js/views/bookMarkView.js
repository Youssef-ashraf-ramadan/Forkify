import previewView from "./previewView";
import { View } from "./view";

class BookmarkView extends View{
    _ParentEl = document.querySelector('.bookmarks__list')
    _errorMessage = `No bookmarks yet find a nice recipe and bookmark it`;

    _generateMarkup() {
        return this._data.map(bookMark => previewView.render(bookMark, false)).join('');
      }
      addEventHandler(handler){
        window.addEventListener('load' , handler);
      }
    
}
export default new BookmarkView();