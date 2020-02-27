(() => {
  // init Global Variables
  const TOKEN_EXPIRATION_MINUTES = 5;
  const API_URL = "http://www.mocky.io/v2/5dba690e3000008c00028eb6";
  const selector = selector => document.querySelector(selector);
  const create = element => document.createElement(element);
  const app = selector("#app");

  // create user container
  const Ul = create("ul");
  Ul.classList.add("container");

  // create logout button
  const logoutButton = create("button");
  logoutButton.innerHTML = "logout";
  logoutButton.classList.add("logout-button");
  logoutButton.addEventListener("click", logoutUser);

  // create login container
  const Login = create("div");
  Login.classList.add("login");

  // create logo image
  const Logo = create("img");
  Logo.src = "./assets/images/logo.svg";
  Logo.classList.add("logo");

  // init form creation
  const Form = create("form");

  // get all form Data
  function getFormData() {
    return [...Form.elements]
      .filter(element => element.tagName === "INPUT")
      .map(input => input.value);
  }

  // logout current user
  function logoutUser() {
    localStorage.removeItem("token");
    location.href = "#login";
    app.appendChild(Login);
    logoutButton.style.display = "none";
    Login.style.display = "block";
    Ul.style.display = "none";
  }

  // test login
  Form.onsubmit = async e => {
    e.preventDefault();
    const [email, password] = getFormData();

    const { url } = await fakeAuthenticate(email.value, password.value);

    location.href = "#users";

    const users = await getDevelopersList(url);
    renderPageUsers(users);
    app.appendChild(logoutButton);
    Ul.style.display = "flex";
    logoutButton.style.display = "block";
  };

  // validate form
  Form.oninput = e => {
    const [email, password, button] = e.target.parentElement.children;
    !email.validity.valid || !email.value || password.value.length <= 5
      ? button.setAttribute("disabled", "disabled")
      : button.removeAttribute("disabled");
  };

  // create form HTML
  Form.innerHTML = `
      <div class="styled-form-container">
          <input
              type="email"
              name="email"
              class="input-main"
              placeholder="Entre com seu e-mail"
              required
          />
          <input
              type="password"
              name="password"
              class="input-main"
              placeholder="Digite sua senha supersecreta"
              required
          />
          <button type="submit" class="button-main">Entrar</button>
      </div>
  `;

  // show logo and login form
  app.appendChild(Logo);
  Login.appendChild(Form);

  // authenticate user
  async function fakeAuthenticate(email, password) {
    const data = await fetch(API_URL).then(res => res.json());

    const fakeJwtToken = `${btoa(email + password)}.${btoa(
      data.url
    )}.${new Date().getTime() + 1000 * 60 * TOKEN_EXPIRATION_MINUTES}`;

    localStorage.setItem("token", fakeJwtToken);

    return data;
  }

  // get an array with all developers
  async function getDevelopersList(url) {
    return await fetch(url).then(res => res.json());
  }

  // show the developers
  function renderPageUsers(users) {
    app.classList.add("logged");
    Login.style.display = "none";
    Ul.innerHTML = "";

    users.forEach(user => {
      const userCard = create("div");
      const userCardBox = create("div");
      const imgUser = create("img");
      const userName = create("span");

      userName.innerHTML = user.login;
      imgUser.src = user.avatar_url;
      imgUser.alt = user.login;

      userCardBox.appendChild(imgUser);
      userCardBox.appendChild(userName);

      userCard.classList.add("user-card");

      userCard.appendChild(userCardBox);

      userCard.addEventListener("click", () => {
        window.open(user.html_url, "_blank");
      });

      Ul.appendChild(userCard);
    });

    app.appendChild(Ul);
  }

  // init
  (async function() {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.split(".") : null;
    if (!token || token[2] < new Date().getTime()) {
      logoutUser();
    } else {
      logoutButton.style.display = "block";
      location.href = "#users";
      const users = await getDevelopersList(atob(token[1]));
      renderPageUsers(users);
      app.appendChild(logoutButton);
    }
  })();
})();
