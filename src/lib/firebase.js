import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getToken, getMessaging, isSupported } from "firebase/messaging";

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

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth();
const db = getDatabase(app);
const dbFirestore = getFirestore(app);

const messaging = async () => {
	const supported = await isSupported();
	return supported ? getMessaging(app) : null;
};

const fetchToken = async () => {
	try {
		const fcmMessaging = await messaging();
		if (fcmMessaging) {
			const currentToken = await getToken(fcmMessaging, {
				vapidKey:
					"BGfRmLvEEjKCxy-craNVw1GNtxkoRhJytWNZV4vQVAKbsEfqJ_mMWaEngYuv5852dkYX1GPkCpltcpFlNFNdPe0",
			});
			return currentToken;
		}
	} catch (error) {
		console.error("Error fetching FCM token:", error);
		return null;
	}
};

export { app, auth, db, dbFirestore, messaging, fetchToken };
