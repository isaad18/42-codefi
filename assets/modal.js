const token = localStorage.getItem('42api-access-token');
fetch('https://api.intra.42.fr/v2/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(intra_res => {

    fetch("/users", {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        username:     intra_res.login,
        profile_url:  "https://profile.intra.42.fr/users/" + intra_res.login,
        name:         intra_res.usual_full_name,
        pic_url:      intra_res.image_url
      }),
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => response.json())
      .then(json => console.log(json));
    // console.log(json.login); 
    // console.log("https://profile.intra.42.fr/users/" + json.login); console.log(json.usual_full_name); console.log(json.image_url);
  });

document.getElementById("start_button").addEventListener("click", () => {
  fetch("/users/mfirdous", {
  // Adding method type
  method: "PUT",

  // Adding body or contents to send
  body: JSON.stringify({
    score:     150,
    completed_count:  "https://profile.intra.42.fr/users/" + intra_res.login,
    username:     'mfirdous',
  }),
  // Adding headers to the request
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
  .then(response => response.json())
  .then(json => console.log(json));
});
  
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    openModal($target);
    // $trigger.addEventListener('click', () => {
    //   openModal($target);
    // });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});