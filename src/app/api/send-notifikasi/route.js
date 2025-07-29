import admin from "firebase-admin";
import { NextResponse } from "next/server";

if (!admin.apps.length) {
	const serviceAccount = {
		type: "service_account",
		project_id: "db-deteksi",
		private_key_id: "24ff0a03fc721f30d5cea494f38de958e0df366a",
		private_key:
			"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUN2r83HmV2b9u\nhDn8JfwHcnOdxmA1pK9rAiuPFNxyi9S+vLY+Mwm39ipYTXbYXp5K+P/GrbT0egru\nd4S1a8ifF31HskLhwl3PwJ06hb8af7Cw0XBujGnjctgD57GVqWKWG5vixwNncLBL\n07ih0tBJb/bVuXt9177Je80yZmGKtTfhYAwkNY4Rud8/DnopItSfDwaL/U787Uq1\n8XsnifmUul5InZ0VyVeLZlT/NroRnEcNacvVi2JQO4Cf3SMAV1AGQpduqXoHE+dI\nwxlr0FvsbNe9fZIe2zJGiBnnHYHrBkj14cz2aoO03uuos+lWg9/qbNhgrQkhkP66\nRQRyH7qBAgMBAAECggEAFGsoCYrEE0FKrop3xIVlGY+KXvd3xJwZ8Hd9kboRfpRF\n7DrqLlpwoc+/WKffUgKC8xgngHLoxW9UtzJu7WFaY5RkVW646QoSS28hGfFX+OoT\naOCJiSk94zAskyklnVUW+E/4Yz8AeI0dNG0H9/8nY56RljL10Mnahj5Qb/uLv4Ru\n7PSvqz++Ydp0s5Wsk9En/hJp6PNoOe9sO1UpCmZcgA9de3rIRdpwovjxOCgrzlrK\n80X+VR6modDGsvJYHmBtSgENnc3Qu/wWHO4VhW1YcuaWI7GdSKMSUiwK+4h+mT/M\ndV/WzP0SEix9/xsesq4XA+L7OemY87QZS9eG0bSP2QKBgQDHt0UFXstrbvLlqyfh\nasL9IodXvywrTHJQ9ORrZHEhcQ3NMnhKzoScFlb5eZkE7Fvo+Du5KwhuvKTm/cH2\nG/NrYcDTRyTUKN5N7/yqgfMYMrwJREbLNzoEvRmQWkZoxfYNn00uxdUm6YOAKOpz\nMgFbXW63PQJUDZoxd1eTpdkwLQKBgQC9/KoAUoKEPnaLngNCNJtOjitVDBh15NyC\nyO/J+sYxfLKFIA/6NHo83tIT4Y8iZTA5neS+qYUDo+/1nAI4rnG2GbN/MyyBouzE\nbmPU0eFLX8bsChlcEk61pX4ZgSxFmRRSudPbp0P4ADVZVdGa1taZFIctsHPjMDQw\njARC9MFUJQKBgEuFI9ZqCCXx6GuskwIMavtpqSAnLD6bQ8cVM6Lgcl8g7wUfBpnT\nChYz5GOl9ZUFA6RO6daVTTUCpKCsaEH2Q8/hQRcjmeuYIKf8DeE0Doah+LTQWqzR\nj2DnWNlbKbDI2sg/6uG68WUrfAxkbHNu/1BbPliP+2dpVVtLM5SjbENpAoGBAIwU\n+jwWmklrzPiQ35I3O7QmO2kP7BExWC3Ofo+MqgnfCboCtAUmIGM1X+xsyZ7wwSga\ndYjncT4H6GxORY0JgqpkNOc7Ejvbp3wGcPGAdv+edQuhPqWWkhZ5GYswpTYD8uo0\nPjOdFw6LCMr/7fafJcflTO6xRiFjb3fEJXhBAzNJAoGAWdd5bnx3iSVy/+xt89q7\nOCR/K4GjluV4TRpNaH3LusQaCvCReKkKOBsrZ/5u8nz0WpYc843EDXJhf+W9vKq0\n0wS8O9IsYJelDsmU7Cu60mlurQ+VczProJ1y0SCIDVce70FkrXt9UbQ1dLua81+C\npSfsDx/yIUWK4lOHbTgKvlY=\n-----END PRIVATE KEY-----\n",
		client_email: "firebase-adminsdk-fbsvc@db-deteksi.iam.gserviceaccount.com",
		client_id: "108603146086743003164",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url:
			"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40db-deteksi.iam.gserviceaccount.com",
		universe_domain: "googleapis.com",
	};

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL:
			"https://db-deteksi-default-rtdb.asia-southeast1.firebasedatabase.app",
	});
}

export async function POST(request) {
	try {
		const { token, title, message, link } = await request.json();

		// Validate payload
		if (!token || !title || !message) {
			return NextResponse.json({
				success: false,
				error: "Missing required fields: token, title, or message.",
			});
		}

		// Construct the payload for the notification
		const payload = {
			token,
			notification: {
				title: title,
				body: message,
			},
			webpush: link
				? {
						fcmOptions: {
							link,
						},
				  }
				: undefined,
		};

		// Send the notification using Firebase Admin SDK
		await admin.messaging().send(payload);

		return NextResponse.json({ success: true, message: "Notification sent!" });
	} catch (error) {
		console.error("Error sending notification:", error);
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ success: false, error: errorMessage });
	}
}
