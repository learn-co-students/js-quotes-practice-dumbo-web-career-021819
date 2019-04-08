// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let quoteList = document.querySelector('#quote-list')
let newQuoteForm = document.querySelector('#new-quote-form')

fetch('http://localhost:3000/quotes')
  .then( (response) => {
    return response.json();
  })
  .then( (quotes) => {
    quotes.forEach( (quote) => {
      quoteList.innerHTML += `<li data-quote-id="${quote.id}" class='quote-card'>
                                <blockquote class="blockquote">
                                  <p class="mb-0">${quote.quote}</p>
                                  <footer class="blockquote-footer">${quote.author}</footer>
                                  <br>
                                  <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
                                  <button class='btn-danger'>Delete</button>
                                </blockquote>
                              </li>`
    })
  })

  newQuoteForm.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      e.preventDefault();
      let author = e.target.parentElement.querySelector('input[name="Author"]').value;
      let newQuote = e.target.parentElement.querySelector('input[name="new-quote"]').value;
      fetch('http://localhost:3000/quotes', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "quote": newQuote,
          "likes": 0,
          "author": author
        })
      }).then( (response) => {
        return response.json();
      }).then( (quote) => {
        quoteList.innerHTML += `<li data-quote-id="${quote.id}" class='quote-card'>
                                  <blockquote class="blockquote">
                                    <p class="mb-0">${quote.quote}</p>
                                    <footer class="blockquote-footer">${quote.author}</footer>
                                    <br>
                                    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
                                    <button class='btn-danger'>Delete</button>
                                  </blockquote>
                                </li>`
      })
    }
  })

  quoteList.addEventListener('click', (e) => {
    if (e.target.className === "btn-success") {
      let likeCount = parseInt(e.target.querySelector('span').innerText);
      let quoteId = parseInt(e.target.parentElement.parentElement.dataset.quoteId);
      likeCount++;
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          likes: likeCount
        })
      })
      .then( (response) => {
        return response.json();
      })
      .then( (quote) => {
        e.target.querySelector('span').innerText = likeCount;
      })
    } else if (e.target.className === "btn-danger") {
      let quoteId = parseInt(e.target.parentElement.parentElement.dataset.quoteId);
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        }
      })
      .then( (response) => {
        return response.json();
      })
      .then( () => {
        e.target.parentElement.parentElement.remove();
      })
    }
  })
