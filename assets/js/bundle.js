// (() => {
const selector = selector => document.querySelector(selector);
const create = element => document.createElement(element);

const app = selector("#app");

const Login = create("div");
Login.classList.add("login");

const Logo = create("img");
Logo.src = "./assets/images/logo.svg";
Logo.classList.add("logo");

const Form = create("form");

const getFormData = () => {
  return [...Form.elements]
    .filter(element => element.tagName === "INPUT")
    .map(input => input.value);
};

Form.onsubmit = async e => {
  e.preventDefault();
  const [email, password] = getFormData();

  const { url } = await fakeAuthenticate(email.value, password.value);

  location.href = "#users";

  const users = await getDevelopersList(url);
  renderPageUsers(users);
};

Form.oninput = e => {
  const [email, password, button] = e.target.parentElement.children;
  !email.validity.valid || !email.value || password.value.length <= 5
    ? button.setAttribute("disabled", "disabled")
    : button.removeAttribute("disabled");
};

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
        <button type="submit" class="button-main" disabled>Entrar</button>
    </div>
`;

app.appendChild(Logo);
Login.appendChild(Form);

async function fakeAuthenticate(email, password) {
  const response = fetch("http://www.mocky.io/v2/5dba690e3000008c00028eb6");
  //   const data = await response.then(res => res.json());

  console.log(response);

  return;

  const fakeJwtToken = `${btoa(email + password)}.${btoa(
    data.url
  )}.${new Date().getTime() + 300000}`;

  localStorage.setItem("token", fakeJwtToken);
  setTimeout(() => {
    localStorage.removeItem("token");
  }, 1000 * 60 * 5);

  console.log(fakeJwtToken);

  return data;
}

// async function getDevelopersList(url) {
//     /**
//      * bloco de código omitido
//      * aqui esperamos que você faça a segunda requisição
//      * para carregar a lista de desenvolvedores
//      */
// }

// function renderPageUsers(users) {
//     app.classList.add('logged');
//     Login.style.display = /* trecho omitido */

//     const Ul = create('ul');
//     Ul.classList.add('container')

//     /**
//      * bloco de código omitido
//      * exiba a lista de desenvolvedores
//      */

//     app.appendChild(Ul)
// }

// // init
// (async function(){
//     const rawToken = /* trecho omitido */
//     const token = rawToken ? rawToken.split('.') : null
//     if (!token || token[2] < (new Date()).getTime()) {
//         localStorage.removeItem('token');
//         location.href='#login';
app.appendChild(Login);
//     } else {
//         location.href='#users';
//         const users = await getDevelopersList(atob(token[1]));
//         renderPageUsers(users);
//     }
// })()
// })();
