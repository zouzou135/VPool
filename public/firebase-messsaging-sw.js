
importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-analytics.js");
const firebaseConfig = {
    apiKey: "AIzaSyD6b1WziW0swgEfGRp_eNNYaQxg3cDAG7E",
    authDomain: "driver-tracker-289510.firebaseapp.com",
    databaseURL: "https://driver-tracker-289510.firebaseio.com",
    projectId: "driver-tracker-289510",
    storageBucket: "driver-tracker-289510.appspot.com",
    messagingSenderId: "1079272224727",
    appId: "1:1079272224727:web:19db61d3805b9c0e0b7d92",
    measurementId: "G-T6HDC6DGSJ"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification("my notification title");
        });
    return promiseChain;
});
self.addEventListener("notificationclick", function (event) {
    console.log(event);
});