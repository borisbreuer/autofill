class Autofill{
  constructor(_id, _data, _options ) {
    this.data = _data;
    this.id = _id;
    this.defaults = { 
      searchSet: ["name"], 
      startsWith: true 
    }
    this.options = Object.assign(this.defaults, _options);
    this.search_inp = document.querySelector(this.id);
    this.result = [];

    this.query;
    this.regex;
    this.resultIndex = -1;
    this.resultItems = [];

    this.wrapperEl;
    this.resultBoxEl;
    this.resultItemEl;
    this.setItemEl;

    this.setWrapper();
    this.setInputEvent();
    this.resultBox();
  }

  search = (e) => {
    this.query = e.target.value;
    this.regex = new RegExp(this.options.startsWith ? "^" + this.query : this.query, 'gi');
    this.result = this.query ? [...this.multiFilter(this.data, this.regex)] : [];
    if(this.result.length > 0) {
      this.renderResult();
    } else {
      this.clearResultBox();
    }
  }

  attachValue = (e) => { 
    this.search_inp.value = e.target.parentNode.firstElementChild.textContent;
    this.clearResultBox();
  }

  upAndDown = (e) => {
    
    if(this.result.length > 0) {
      if(e.key === "ArrowDown" || e.key === "ArrowUp") {


        if(this.resultIndex >= 0 ) this.resultItems[this.resultIndex].classList.remove("focus");

        if(e.key === "ArrowDown") {
          if(this.resultIndex < this.result.length - 1) this.resultIndex++;
        }

        if(e.key === "ArrowUp") {
          if(this.resultIndex > 0) this.resultIndex--;
        }

        this.resultItems[this.resultIndex].classList.add("focus");
      }

      if(e.key === "Enter") {
        this.search_inp.value = this.result[this.resultIndex][this.options.searchSet[0]];
        this.clearResultBox();
      }
    }
  }

  multiFilter(data, regex) {
    let result = [];
    for(let item of this.options.searchSet){
      result = [...result, ...data.filter((d) => d[item].match(regex))];
    }
    return result;
  }

  renderResult() {
    this.clearResultBox();

    this.result.forEach((item) => {
      this.resultItemEl = document.createElement('div');
      this.resultItemEl.className = 'result-item';

      for(let setItem of this.options.searchSet){
        const label = item[setItem].replace(this.regex, (m) => `<mark>${m}</mark>`);
        this.setItemEl = document.createElement('div');
        this.setItemEl.className = 'set-item';
        this.setItemEl.innerHTML = label;
        this.resultItemEl.appendChild(this.setItemEl);
      }

      this.resultItemEl.dataset.id = item.id;
      this.setClickEvent(this.resultItemEl);
      this.resultBoxEl.appendChild(this.resultItemEl);
    })

    this.setResultItems();
    this.showResultBox();
  }

  setWrapper() {
    let temp_search = this.search_inp.cloneNode();

    this.wrapperEl = document.createElement('div');
    this.wrapperEl.className = 'autofill-wrapper'
    this.search_inp.parentNode.replaceChild(this.wrapperEl, this.search_inp);

    this.search_inp = temp_search;
    this.wrapperEl.appendChild(this.search_inp)
  }

  resultBox() {
    this.resultBoxEl = document.createElement('div');
    this.resultBoxEl.className = 'result-box';
    this.wrapperEl.appendChild(this.resultBoxEl);
  }
  
  clearResultBox() {
    this.resultIndex = -1;
    this.resultItems = [];
    if(this.resultItems.length > 0){
      for(let item of this.resultItems) this.removeClickEvent(item)
    }
    this.resultBoxEl.innerHTML = "";
    this.resultBoxEl.style.display = "none";
  }

  showResultBox() {
    this.resultBoxEl.style.display = "block";
  }

  setResultItems(){
    this.resultItems = [...this.resultBoxEl.querySelectorAll('.result-item')];
  }

  setInputEvent() {
    this.search_inp.addEventListener('input', this.search);
    this.search_inp.addEventListener('keydown', this.upAndDown);
  }

  setClickEvent(element) {
    element.addEventListener('click', this.attachValue)
  }

  removeClickEvent(element) {
    element.removeEventListener('click', this.attachValue)
  }

}