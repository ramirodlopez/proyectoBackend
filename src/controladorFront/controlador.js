function render(data) {
  const html = data
    .map((elem, index) => {
      return `<div align = "left">
            <p><strong style='color: blue'>${elem.mail}</strong> <span style='color: brown'>${elem.tiempo}</span>: <span>${elem.texto}</span></p></div>`;
    })
    .join(" ");
  document.getElementById("mensajes").innerHTML = html;
}

function renderUser(data) {
  const html = data
    .map((elem, index) => {
      return `<div align = "left">
            <p><strong style='color: blue'>Bienvenido ${elem.user}</strong></p></div>`;
    })
    .join(" ");
  document.getElementById("usuario").innerHTML = html;
}
