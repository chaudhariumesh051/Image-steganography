let encodebtn = document.getElementById("encodebtn");
let encodeimage1fileinput = document.getElementById("encodeimage1");

let canvasbox = document.getElementById("canvasbox");
let secretTextField = document.getElementById("secretText");
let secretTextField1 = document.getElementById("secretText1");

let loadedImage;
let encodedImage;

let decodebtn = document.getElementById("decodebtn");
let decodeimage1fileinput = document.getElementById("decodeimage1");
let decodeimage2fileinput = document.getElementById("decodeimage2");

let decodeimage1;
let decodeimage2;

encodebtn.addEventListener("click", (e) => 
  {
  console.log("encoding...");
  encodebtn.classList.add("disbaled");

  if (encodeimage1fileinput.files && encodeimage1fileinput.files[0]) {

    loadedImage = loadImage(
      URL.createObjectURL(encodeimage1fileinput.files[0]),
      () => {

        loadedImage.loadPixels();
        console.log("Pixel data:", loadedImage.pixels);

        let secretText = secretTextField.value;
        console.log("secret message:", secretText);

        encodedImage = createImage(loadedImage.width, loadedImage.height);
        encodedImage.copy(
          loadedImage,
          0,
          0,
          loadedImage.width,
          loadedImage.height,
          0,
          0,
          loadedImage.width,
          loadedImage.height,
        );

        encodedImage.loadPixels();
        console.log("Pixel data:", encodedImage.pixels);

        encodeMessage(encodedImage, secretText);

        downloadEncodedImage(encodedImage, "encoded_image.jpg");
      },
    );
  } else {
    alert("Please select an image file.");
  }
});

decodebtn.addEventListener("click", (e) => {
  console.log("decoding...");
  decodebtn.classList.add("disabled");

  if (
    decodeimage1fileinput.files &&
    decodeimage1fileinput.files[0] &&
    decodeimage2fileinput.files &&
    decodeimage2fileinput.files[0]
  ) {
    loadImage(URL.createObjectURL(decodeimage1fileinput.files[0]), (img1) => {
      loadImage(URL.createObjectURL(decodeimage2fileinput.files[0]), (img2) => {

        let decodedMessage = decodeMessage(img1, img2);
        console.log("Decoded Message:", decodedMessage);

        secretTextField1.value = decodedMessage;

        decodebtn.classList.remove("disabled");
      });
    });
  } else {
    alert("Please select both image files.");
  }
});

function setup() {}

function draw() {
  noLoop();
}

function encodeMessage(img, message) {
  let binaryMessage = textToBinary(message);
  img.loadPixels();

  let index = 0;
  for (let i = 0; i < img.pixels.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      if (index < binaryMessage.length) {

        let bit = int(binaryMessage[index]);

        if (bit === 1 && img.pixels[i + j] < 255) {
          img.pixels[i + j]++;
        } else if (bit === 1 && img.pixels[i + j] == 255) {
          img.pixels[i + j]--;
        }

        index++;
      }
    }
  }

  img.updatePixels();
}

function textToBinary(text) {
  let binaryMessage = "";
  for (let i = 0; i < text.length; i++) {
    let binaryChar = text[i].charCodeAt(0).toString(2);
    binaryMessage += "0".repeat(8 - binaryChar.length) + binaryChar;
  }
  return binaryMessage;
}

function downloadEncodedImage(img, filename) {

  let link = document.createElement("a");

  let dataURL = img.canvas.toDataURL();

  link.href = dataURL;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

function decodeMessage(originalImage, encodedImage) {
  let decodedMessage = "";
  originalImage.loadPixels();
  encodedImage.loadPixels();

  for (let i = 0; i < originalImage.pixels.length; i += 4) {
    for (let j = 0; j < 3; j++) {

      let originalValue = int(originalImage.pixels[i + j]);
      let encodedValue = int(encodedImage.pixels[i + j]);

      if (originalValue !== encodedValue) {
        decodedMessage += "1";
      } else {
        decodedMessage += "0";
      }
    }
  }

  let textMessage = binaryToText(decodedMessage);
  return textMessage;
}

function binaryToText(binaryMessage) {
  let textMessage = "";
  for (let i = 0; i < binaryMessage.length; i += 8) {
    let byte = binaryMessage.substr(i, 8);
    textMessage += String.fromCharCode(parseInt(byte, 2));
  }
  return textMessage;
}