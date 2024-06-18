const firebaseConfig = {
    apiKey: "AIzaSyAOi8TjJm6LTiwxQDyWfsrAyYnqFDHUHdY",
    authDomain: "contactform-1a045.firebaseapp.com",
    databaseURL: "https://contactform-1a045-default-rtdb.firebaseio.com",
    projectId: "contactform-1a045",
    storageBucket: "contactform-1a045.appspot.com",
    messagingSenderId: "1075076557330",
    appId: "1:1075076557330:web:21b7b587dbdec1d6d246cb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference your database
var contactFormDB = firebase.database().ref("contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    var name = getElementVal("name");
    var emailid = getElementVal("emailid");
    var msgContent = getElementVal("msgContent");

    saveMessages(name, emailid, msgContent);

    // Enable alert
    document.querySelector(".alert").style.display = "block";

    // Remove the alert after 3 seconds
    setTimeout(() => {
        document.querySelector(".alert").style.display = "none";
    }, 3000);

    // Reset the form
    document.getElementById("contactForm").reset();
}

const saveMessages = (name, emailid, msgContent) => {
    var newContactForm = contactFormDB.push();

    newContactForm.set({
        name: name,
        emailid: emailid,
        msgContent: msgContent,
    });
};

const getElementVal = (id) => {
    return document.getElementById(id).value;
};
