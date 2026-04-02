const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const battleModeToggle = document.getElementById("battle-mode-toggle");
const searchSection = document.getElementById("search-section");
const battleSection = document.getElementById("battle-section");
const battleInput1 = document.getElementById("battle-input-1");
const battleInput2 = document.getElementById("battle-input-2");
const battleButton = document.getElementById("battle-button");
const card1 = document.getElementById("profile-card-3");
const card2 = document.getElementById("profile-card-2");

const getNotFoundAvatar = () =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
      <rect width="160" height="160" rx="32" fill="#FFF7ED" />
      <circle cx="80" cy="72" r="34" fill="#FDBA74" />
      <path d="M54 112c7-16 20-24 26-24s19 8 26 24" stroke="#9A3412" stroke-width="10" stroke-linecap="round" />
      <path d="M64 68h0.01M96 68h0.01" stroke="#9A3412" stroke-width="10" stroke-linecap="round" />
    </svg>
  `)}`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const fetchTotalStars = async (reposUrl, publicRepos = 0) => {
  const totalPages = Math.max(1, Math.ceil((publicRepos || 0) / 100));
  let totalStars = 0;

  for (let page = 1; page <= totalPages; page += 1) {
    const pagedUrl = new URL(reposUrl);
    pagedUrl.searchParams.set("per_page", "100");
    pagedUrl.searchParams.set("page", String(page));

    const response = await fetch(pagedUrl);
    if (!response.ok) {
      throw new Error("Unable to fetch repositories for stars");
    }

    const repos = await response.json();
    totalStars += repos.reduce((sum, repo) => {
      if (repo.fork) {
        return sum;
      }

      return sum + (repo.stargazers_count || 0);
    }, 0);
  }

  return totalStars;
};

const renderRepositories = (repos, userIndex, options = {}) => {
  const { emptyMessage = "No repositories found." } = options;
  const repoList = document.getElementById(`repo-list-${userIndex}`);
  const repoEmpty = document.getElementById(`repo-empty-${userIndex}`);
  repoList.innerHTML = ""; // Clear previous repos

  if (!repos || !repos.length) {
    repoEmpty.textContent = emptyMessage;
    repoEmpty.classList.remove("hidden");
    return;
  }

  repoEmpty.classList.add("hidden");
  repos.slice(0, 5).forEach((repo) => {
    const repoItem = document.createElement("li");
    repoItem.className = "rounded-xl border border-slate-200 bg-slate-50 p-3";
    repoItem.innerHTML = `
      <a href="${repo.html_url}" class="font-semibold text-blue-700 hover:text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">${repo.name}</a>
      <p class="mono mt-1 text-xs uppercase tracking-wide text-slate-500">Created: ${formatDate(repo.created_at)}</p>
    `;
    repoList.appendChild(repoItem);
  });
};

const renderUser = (data, userIndex, options = {}) => {
  const { includeStars = false } = options;
  const card = document.getElementById(`profile-card-${userIndex}`);
  card.classList.remove("not-found-card");
  document.getElementById(`name-${userIndex}`).textContent =
    data.name || "No Name";
  document.getElementById(`title-${userIndex}`).textContent =
    data.bio || "No Bio";
  document.getElementById(`join-date-${userIndex}`).textContent =
    `Join date: ${formatDate(data.created_at)}`;
  const portfolioEl = document.getElementById(`portfolio-url-${userIndex}`);
  if (data.blog) {
    const href = data.blog.startsWith("http")
      ? data.blog
      : `https://${data.blog}`;
    portfolioEl.innerHTML = `Portfolio: <a class="text-blue-600 hover:underline" href="${href}" target="_blank" rel="noopener noreferrer">${data.blog}</a>`;
  } else {
    portfolioEl.textContent = "No Portfolio";
  }
  document.getElementById(`followers-${userIndex}`).textContent =
    `Followers: ${data.followers}`;
  document.getElementById(`profile-picture-${userIndex}`).src = data.avatar_url;

  const repoUrl = new URL(data.repos_url);
  repoUrl.searchParams.set("sort", "created");
  repoUrl.searchParams.set("direction", "desc");
  repoUrl.searchParams.set("per_page", "5");

  const latestReposPromise = fetch(repoUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Unable to fetch repositories");
      return response.json();
    })
    .then((repos) => {
      renderRepositories(repos, userIndex);
    });

  const starsPromise = includeStars
    ? fetchTotalStars(data.repos_url, data.public_repos)
        .then((totalStars) => {
          const starsEl = document.getElementById(`stars-${userIndex}`);
          if (starsEl) {
            starsEl.textContent = `Total Stars: ${totalStars.toLocaleString()}`;
          }
        })
        .catch(() => {
          const starsEl = document.getElementById(`stars-${userIndex}`);
          if (starsEl) {
            starsEl.textContent = "Total Stars: Unavailable";
          }
        })
    : Promise.resolve();

  return Promise.all([latestReposPromise, starsPromise]).then(() => data);
};

const resetUserCard = (userIndex) => {
  document
    .getElementById(`profile-card-${userIndex}`)
    .classList.remove("not-found-card");
  document.getElementById(`name-${userIndex}`).textContent = "";
  document.getElementById(`title-${userIndex}`).textContent = "";
  document.getElementById(`join-date-${userIndex}`).textContent = "";
  document.getElementById(`portfolio-url-${userIndex}`).textContent = "";
  document.getElementById(`followers-${userIndex}`).textContent = "";
  const starsEl = document.getElementById(`stars-${userIndex}`);
  if (starsEl) {
    starsEl.textContent = "";
  }
};

const fetchUser = (username, userIndex, options = {}) => {
  const { throwOnError = false, includeStars = false } = options;
  const nameElement = document.getElementById(`name-${userIndex}`);
  nameElement.innerHTML = '<div class="spinner"></div>';
  resetUserCard(userIndex);

  return fetch(`https://api.github.com/users/${username}`)
    .then((response) => {
      if (!response.ok) throw new Error(`User ${username} not found`);
      return response.json();
    })
    .then((data) => renderUser(data, userIndex, { includeStars }))
    .catch((error) => {
      const card = document.getElementById(`profile-card-${userIndex}`);
      card.classList.add("not-found-card");
      document.getElementById(`name-${userIndex}`).textContent = "Signal lost";
      document.getElementById(`title-${userIndex}`).textContent =
        `No GitHub profile matched “${username}”.`;
      document.getElementById(`join-date-${userIndex}`).textContent =
        "Try a different handle or trim any extra spaces.";
      document.getElementById(`portfolio-url-${userIndex}`).textContent =
        "Search hint: GitHub usernames must exist exactly as entered.";
      document.getElementById(`followers-${userIndex}`).textContent =
        "Status: not found";
      document.getElementById(`profile-picture-${userIndex}`).src =
        getNotFoundAvatar();
      renderRepositories([], userIndex, {
        emptyMessage:
          "No match yet. Use another username to re-lock the signal.",
      });
      if (throwOnError) {
        throw error;
      }

      return null;
    });
};

battleModeToggle.addEventListener("change", () => {
  if (battleModeToggle.checked) {
    battleSection.classList.remove("hidden");
    searchSection.classList.add("hidden");
  } else {
    battleSection.classList.add("hidden");
    searchSection.classList.remove("hidden");
    card1.classList.remove("winner-card", "loser-card");
    card2.classList.remove("winner-card", "loser-card");
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = searchInput.value.trim();
  if (username !== "") {
    fetchUser(username, 1);
  }
});

battleButton.addEventListener("click", () => {
  const username1 = battleInput1.value.trim();
  const username2 = battleInput2.value.trim();

  if (username1 === "" || username2 === "") {
    alert("Please enter two usernames.");
    return;
  }

  // Reset colors
  card1.classList.remove("winner-card", "loser-card");
  card2.classList.remove("winner-card", "loser-card");

  Promise.all([
    fetchUser(username1, 3, { throwOnError: true, includeStars: true }),
    fetchUser(username2, 2, { throwOnError: true, includeStars: true }),
  ])
    .then(([user1, user2]) => {
      if (user1.followers > user2.followers) {
        card1.classList.add("winner-card");
        card2.classList.add("loser-card");
      } else if (user2.followers > user1.followers) {
        card2.classList.add("winner-card");
        card1.classList.add("loser-card");
      }
    })
    .catch((error) => {
      console.error("Battle failed:", error);
    });
});

// default load
fetchUser("octocat", 1);
