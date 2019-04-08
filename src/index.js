// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.


const createNewQuoteCardHtml = (quote) => {
  return `<li class='quote-card' data-id="${quote.id}">
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span data-like-count="${quote.likes}">${quote.likes}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>
</li>`
}

const quoteUlTag = document.querySelector("#quote-list");
fetch("http://localhost:3000/quotes")
  .then((response) => {
    return response.json()
  }).then((quotes) => {
    quotes.forEach((quote) => {
      return quoteUlTag.innerHTML += createNewQuoteCardHtml(quote)
    })
  })

const quoteUrl = fetch("http://localhost:3000/quotes")
const quoteFormTag = document.querySelector('#new-quote-form')
quoteFormTag.addEventListener('submit', (event) => {
  event.preventDefault();

  let newObj = {
    quote: event.target['new-quote'].value,
    author: event.target.author.value,
    likes: 0
  };
  quoteUrl.then((response) => {
    createNewQuote(newObj).then((newQuote) => {
      quoteUlTag.innerHTML += createNewQuoteCardHtml(newQuote)
    })
  })
})

const createNewQuote = (quote) => {
  return fetch("http://localhost:3000/quotes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(quote)
  }).then((response) => {
        return response.json()
      })
  }


//accessing the server for a particular id
  const updateLikeCount = (id, likeCount) => {
    return fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({likes: likeCount})
    }).then((response) => {
      return response.json();
    })
  }

  const deleteQuote = (id) => {
    return fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'DELETE'
    })
  }

//Adding likes to quote
  quoteUlTag.addEventListener('click', (event) => {
    if (event.target.className === 'btn-success') {
      let currentButtonTag = event.target
      let likeSpanTag = event.target.parentElement.querySelector('span')
      let newLikeCount =  parseInt(likeSpanTag.innerText)
      newLikeCount++;
      let currentLi = event.target.parentElement.parentElement
      updateLikeCount(currentLi.dataset.id, newLikeCount).then((quote) => {
        likeSpanTag.dataset.likeCount = quote.likes
        let newLikeCount = `${quote.likes}`
        likeSpanTag.innerText = newLikeCount
      })
    }
  })

quoteUlTag.addEventListener('click', (event) => {
  if (event.target.className === 'btn-danger') {
    let currentCard = event.target.parentElement.parentElement
    deleteQuote(currentCard.dataset.id)
    currentCard.remove();
  }
})
