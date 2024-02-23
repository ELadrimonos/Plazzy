
// https://goqr.me/api/doc/create-qr-code/ //

export const generarQRLobby = () => {
  //TODO probar en red local
  const imgQRCode = document.getElementById("QRcode");

  let url = window.location.href;
  console.log(url)
  imgQRCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + url + "";
}

