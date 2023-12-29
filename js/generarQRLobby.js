const imgQRCode = document.getElementById("QRcode");

// https://goqr.me/api/doc/create-qr-code/ //

const generarQRLobby = () => {
  //TODO Cambiar a dominio del alojamiento web en cuanto esté listo
  let url = window.location.href;
  imgQRCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + url + "";
}

generarQRLobby()