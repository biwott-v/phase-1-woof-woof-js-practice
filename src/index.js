document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.querySelector('#dog-bar');
  const dogInfo = document.querySelector('#dog-info');
  const filterBtn = document.querySelector('#good-dog-filter');
  let pups = [];
  let filterOn = false;

  function fetchPups() {
    fetch('http://localhost:3000/pups')
      .then(res => res.json())
      .then(data => {
        pups = data;
        renderPups();
      });
  }

  function renderPups() {
    dogBar.innerHTML = '';
    const filteredPups = filterOn ? pups.filter(pup => pup.isGoodDog) : pups;
    filteredPups.forEach(pup => {
      const span = document.createElement('span');
      span.textContent = pup.name;
      span.dataset.id = pup.id;
      dogBar.appendChild(span);
    });
  }

  function showPupInfo(pup) {
    dogInfo.innerHTML = `
      <img src="${pup.image}">
      <h2>${pup.name}</h2>
      <button>${pup.isGoodDog ? 'Good' : 'Bad'} Dog!</button>
    `;
    const btn = dogInfo.querySelector('button');
    btn.addEventListener('click', () => toggleGoodness(pup));
  }

  function toggleGoodness(pup) {
    pup.isGoodDog = !pup.isGoodDog;
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({isGoodDog: pup.isGoodDog})
    })
    .then(() => {
      btn.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      renderPups(); // Update dog bar if filtering
    });
  }

  filterBtn.addEventListener('click', () => {
    filterOn = !filterOn;
    filterBtn.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;
    renderPups();
  });

  dogBar.addEventListener('click', e => {
    if (e.target.tagName === 'SPAN') {
      const pup = pups.find(p => p.id == e.target.dataset.id);
      showPupInfo(pup);
    }
  });

  fetchPups();
});
