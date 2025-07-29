importScripts(
	"https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
	apiKey: "AIzaSyAocnTVfQ0E_ueLqhnZwwZ5jt-nhCa0g64",
	authDomain: "db-deteksi.firebaseapp.com",
	databaseURL:
		"https://db-deteksi-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "db-deteksi",
	storageBucket: "db-deteksi.appspot.com",
	messagingSenderId: "164350645102",
	appId: "1:164350645102:web:32446134bc20f868c3677f",
	measurementId: "G-W0WH88VM3R",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload
	);

	// payload.fcmOptions?.link comes from our backend API route handle
	// payload.data.link comes from the Firebase Console where link is the 'key'
	const link = payload.fcmOptions?.link || payload.data?.link;

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: "./logo.png",
		data: { url: link },
	};
	self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const targetUrl = event.notification.data?.url || "/";

	event.waitUntil(
		clients
			.matchAll({
				type: "window",
				includeUncontrolled: true,
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url.includes(targetUrl) && "focus" in client) {
						return client.focus();
					}
				}
				return clients.openWindow(targetUrl);
			})
	);
});
