const api = "http://15.207.115.51:3000/user";
const msg = document.getElementById("message");

function handleSignUp(e) {
  e.preventDefault();
  msg.innerHTML = "";
  const obj = {
    name: e.target.name.value,
    email: e.target.email.value,
    password: e.target.password.value,
  };
  addData(obj);
  e.target.reset();
}

function handleLogin(e) {
  e.preventDefault();
  msg.innerHTML = "";
  const obj = {
    email: e.target.email.value,
    password: e.target.password.value,
  };
  userLogin(obj);
  e.target.reset();
}

async function userLogin(obj) {
  try {
    const user = await axios.post(api + "/login", obj);
    console.log(user);
    if (user.data.success) {
      alert(`${user.data.msg}`);
      localStorage.setItem("token", user.data.token);
      window.location.href = `${window.location.origin}/expense.html`;
    }
  } catch (error) {
    console.log(error);
    updateDOM(error);
  }
}

async function addData(obj) {
  try {
    const user = await axios.post(api + "/signup", obj);
    if (user) {
      alert(`${user.data.msg}`);
      window.location.href = `${window.location.origin}/login.html`;
    }
  } catch (error) {
    console.log(error);
    updateDOM(error);
  }
}

function updateDOM(user) {
  const para = document.createElement("p");
  para.textContent = `Error: ${user.message}`;
  para.style.color = "red";
  msg.appendChild(para);
}
