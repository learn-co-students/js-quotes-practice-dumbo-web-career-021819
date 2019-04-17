// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

const quotesUrl = 'http://localhost:3000/quotes'
const ulTag = document.getElementById("quote-list")

const formTag = document.getElementById("new-quote-form")

const createQuoteCard = (quote) => {
  return `<li class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' data-likes=${quote.likes} data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id=${quote.id}>Delete</button>
  </blockquote>
</li>`
}

fetch(quotesUrl)
.then((response) => {
  return response.json()
}).then((quotes) => {
  quotes.forEach((quote) => {
    // debugger;
    ulTag.innerHTML += createQuoteCard(quote)
  })
})

const addNewQuoteServer = (quoteObj) => {
  return fetch(quotesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(quoteObj)
  }).then((response) => {
    return response.json()
  })
}




formTag.addEventListener('submit', (event) => {
  event.preventDefault();
  const newAuthor = event.target.author.value;
  const newQuote = event.target["new-quote"].value;

  const newQuoteObj = {
    quote: newQuote,
    author: newAuthor,
    likes: 0
  }

  addNewQuoteServer(newQuoteObj).then((response) => {
    ulTag.innerHTML += createQuoteCard(response)
  })
})


//////////REMOVE FROM SERVER

const removeQuoteServer = (quoteId) => {
  return fetch(`${quotesUrl}/${quoteId}`, {
    method: 'DELETE'
  })
}


///////UPDATE LIKE COUNT ON THE SERVER
const updateLikeCountServer = (quoteId, likeCount) => {
  return fetch(`${quotesUrl}/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: likeCount
    })
  }).then((response) => {
    return response.json()
  })
}





ulTag.addEventListener('click', (event) => {
    if (event.target.className === "btn-danger") {
      // debugger;
      const quoteId = parseInt(event.target.dataset.id)
      removeQuoteServer(quoteId);
      event.target.parentElement.parentElement.remove()
      }

    else if (event.target.className === "btn-success") {
      let likeCount = parseInt(event.target.querySelector('span').innerText)
      likeCount++;

      const quoteId = parseInt(event.target.dataset.id);
      // debugger;

      updateLikeCountServer(quoteId, likeCount).then((response) => {
        // debugger;
        const span = event.target.firstElementChild
        span.innerText = response.likes;

      })


        // debugger;

    }
    })








})














































































//
//
//
//
// const formTag = document.getElementById("new-quote-form")
// const quotesUrl = 'http://localhost:3000/quotes'
// const ulTag = document.getElementById("quote-list")
//
//
// const createQuote = (quote) => {
//   return `<li class='quote-card'>
//     <blockquote class="blockquote">
//       <p class="mb-0">${quote.quote}</p>
//       <footer class="blockquote-footer">${quote.author}</footer>
//       <br>
//       <button class='btn-success'>Likes: <span data-likes=${quote.likes}>${quote.likes}</span></button>
//       <button class='btn-danger' data-id=${quote.id}>Delete</button>
//     </blockquote>
//   </li>`
// }
//
//
// fetch(quotesUrl)
// .then((response) => {
//   return response.json()
// }).then((quotes) => {
//   quotes.forEach((quote) => {
//     ulTag.innerHTML += createQuote(quote)
//   })
// })

// configObject = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   body: JSON.stringify({
//     quote: ${quote.quote},
//     author: ${quote.author},
//     likes:
//   })
//
//
// }



// formTag.addEventListener('submit', (event) => {
//   event.preventDefault()
//   debugger;
//   // console.log(event)
//
//   const newAuthorName = event.target.author.value
//   const newQuote = event.target["new-quote"].value
//   const quoteObj = {
//     quote: newQuote,
//     author: newAuthorName,
//     likes: 0
//   }
//
//   ulTag.innerHTML += createQuote(quoteObj)
//
// }
