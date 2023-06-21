class SearchView {
  _prentEl = document.querySelector('.search');

  getQuery() {
    const query = this._prentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._prentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._prentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
