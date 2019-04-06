// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
window.addEventListener('DOMContentLoaded', () => {
  const quoteUl = document.querySelector("#quote-list");

  quoteUl.addEventListener('click', (event) => {

    if (event.target.className ==  'edit-btn') {

      event.target.parentElement.addEventListener('submit', (event) => {
        fetch(`http://localhost:3000/quotes/${event.target.parentElement.parentElement.parentElement.dataset.id}`, {
            method: 'PATCH',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }, body: JSON.stringify(
              {
                "quote": `${event.target[0].value}`,
                "author": `${event.target[1].value}`,
              }
            ) })
          .then((response) => {
            response.json();
          })
        });
        event.target.parentElement.parentElement.querySelector('p').textContent = event.target[0].value;
        event.target.parentElement.parentElement.querySelector('.blockquote-footer').textContent = event.target[1].value
    }
  });

  const createQuoteLi = (quote) => {
    return `<li class='quote-card' data-id= ${quote.id}>
              <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
              <button class='btn-danger'>Delete</button>
                <div class="edit-form">
                  <form class="edit-quote-form" style="">
                  <h3>Edit the quote!</h3>
                  <input type="text" name="quote" value="" placeholder="Enter the quoete..." class="input-text">
                  <br>
                  <input type="text" name="author" value="" placeholder="Enter the quoet's author..." class="input-text">
                  <br>
                  <input type="submit" name="submit" value="Edit Quote" id="submit" class="edit-btn">
                  </form>
                </div>
              </blockquote>
            </li>`
  };

  const deleteQuote = (id) => {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  })
};

  fetch(`http://localhost:3000/quotes`)
    .then((response) => {
      return response.json();
    }).then((quotes) =>{
      quotes.forEach((quote) => {
        quoteUl.innerHTML += createQuoteLi(quote);
      })
    })

  document.querySelector("#new-quote-form").addEventListener('submit', (event) => {

    let postObj = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }, body: JSON.stringify(
          {
            "quote": `${event.target[0].value}`,
            "likes": 0,
            "author": `${event.target[1].value}`,
          }
        ) }

    fetch(`http://localhost:3000/quotes`, postObj)
      .then((response) => {
        return response.json();
      }).then((newQuote) => {
        createQuoteLi(newQuote);
      })
  });

  quoteUl.addEventListener('click', (event) => {
      if (event.target.className == 'btn-danger') {
      deleteQuote(event.target.parentElement.parentElement.dataset.id)
      event.target.parentElement.parentElement.delete();
    } else if (event.target.className == 'btn-success') {
      likeCount = parseInt(event.target.parentElement.querySelector('span').innerText);
      fetch(`http://localhost:3000/quotes/${event.target.parentElement.parentElement.dataset.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }, body: JSON.stringify(
          {
            "likes": ++likeCount
          })}).then((response) => {
        return response.json();
      });
        event.target.parentElement.querySelector('span').innerText = likeCount;
  };
});

  // DOMContentLoaded
  });
