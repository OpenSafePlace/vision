let auth = {
  name: null,
  pass: null
};

window.api.invoke('auth-get').then((credentials) => auth = credentials);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    let
      inputName = document.getElementById("auth-name"),
      inputPass = document.getElementById("auth-pass"),
      stageStart = document.getElementById("stage-start"),
      stageMenu = document.getElementById("stage-menu"),
      btnSave = document.getElementById("auth-btn");

    stageStart.style.display = "none";
    stageMenu.style.display = "block";

    inputName.value = auth.name;
    inputPass.value = auth.pass;

    btnSave.addEventListener("click", () => {
      if (inputName.value != "" && inputPass.value != "")
        window.api.invoke('auth-save', { name: inputName.value, pass: inputPass.value });
      else
        window.api.invoke('auth-empty');
    });
  }, 1500);
});
