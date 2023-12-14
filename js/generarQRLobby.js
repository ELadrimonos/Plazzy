const imgQRCode = document.getElementById("QRcode");

// https://goqr.me/api/doc/create-qr-code/ //

const generarQRLobby = () => {
  //TODO probar en red local
  let url = window.location.href + "?lobby=" + obtenerCodigoLobby();
  //TODO Cambiar al url de arriba
  // let url = "https://google.es"
    console.log(url)
  imgQRCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + url + ""
}

generarQRLobby()