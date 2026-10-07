// ========================================================
// Sakthi Vignesh V - Portfolio Database Configuration
// Powered by Firebase Cloud Firestore
// ========================================================
// 
// HOW TO CONNECT YOUR LIVE FIREBASE DATABASE:
// 1. Go to https://console.firebase.google.com/ and create a free project (e.g., 'sakthi-portfolio').
// 2. Click "Firestore Database" -> "Create Database" -> choose "Start in test mode" -> "Enable".
// 3. In Project Settings (gear icon) -> "General" -> "Your apps" -> Add Web App (</>).
// 4. Copy your firebaseConfig object and paste your credentials below!
// ========================================================

const firebaseConfig = {
    apiKey: "AIzaSyAR7DghN36vRJ2fnq3vFCixOcy6lIrxblM",
    authDomain: "sakthi-portfolio-d886d.firebaseapp.com",
    projectId: "sakthi-portfolio-d886d",
    storageBucket: "sakthi-portfolio-d886d.firebasestorage.app",
    messagingSenderId: "801440340813",
    appId: "1:801440340813:web:2f7268d9628d8e6bec7504",
    measurementId: "G-92RBRL84ZG"
};

// Database State Controller
let db = null;
let isFirebaseLive = false;

// Check if credentials have been provided
function checkIsFirebaseConfigured() {
    return firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_API_KEY" && 
           firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

// Initialize Firestore
try {
    if (typeof firebase !== 'undefined' && checkIsFirebaseConfigured()) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseLive = true;
        console.log("🔥 [Database] Connected to live Firebase Firestore!");
    } else {
        console.info("⚡ [Database] Firebase placeholder detected. Automatic LocalStorage Backup Database is ACTIVE.");
    }
} catch (error) {
    console.error("⚠️ [Database] Firebase initialization failed:", error);
}

/**
 * Direct REST API write to Firestore (100% reliable across file://, localhost, and live web hosting)
 */
async function saveToFirestoreViaRest(record) {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/messages?key=${firebaseConfig.apiKey}`;
    const body = {
        fields: {
            name: { stringValue: record.name || "" },
            email: { stringValue: record.email || "" },
            message: { stringValue: record.message || "" },
            createdAt: { stringValue: record.createdAt || new Date().toISOString() },
            displayDate: { stringValue: record.displayDate || new Date().toLocaleString() },
            status: { stringValue: record.status || "unread" },
            platform: { stringValue: record.platform || "Web Browser" }
        }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Firestore REST error (${response.status}): ${errorText}`);
    }

    return await response.json();
}

/**
 * Direct REST API fetch from Firestore
 */
async function getFromFirestoreViaRest() {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/messages?key=${firebaseConfig.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        if (!data || !data.documents) return [];

        return data.documents.map(doc => {
            const f = doc.fields || {};
            return {
                id: (doc.name || "").split('/').pop(),
                name: f.name ? f.name.stringValue : 'Anonymous',
                email: f.email ? f.email.stringValue : '',
                message: f.message ? f.message.stringValue : '',
                createdAt: f.createdAt ? f.createdAt.stringValue : '',
                displayDate: f.displayDate ? f.displayDate.stringValue : ''
            };
        });
    } catch (e) {
        console.warn("REST fetch fallback error:", e);
        return null;
    }
}

/**
 * Saves a new contact inquiry to Firebase Firestore (Dual SDK + REST Engine)
 * @param {Object} messageData { name, email, message }
 * @returns {Promise<{success: boolean, mode: string, error?: any}>}
 */
async function saveContactMessage({ name, email, message }) {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString();

    const newRecord = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: timestamp,
        displayDate: formattedDate,
        status: "unread",
        platform: navigator.userAgent || "Web Browser"
    };

    // 1. Always save locally so zero messages are lost
    try {
        const localMessages = JSON.parse(localStorage.getItem('sv_portfolio_messages') || '[]');
        localMessages.unshift(newRecord);
        localStorage.setItem('sv_portfolio_messages', JSON.stringify(localMessages));
    } catch (e) {
        console.warn("Could not save to localStorage backup:", e);
    }

    // 2. Try Firestore Direct REST API first (fastest and works reliably in file:// & https://)
    try {
        console.log("🚀 [Database] Sending message to Firestore Cloud...");
        const restResult = await saveToFirestoreViaRest(newRecord);
        console.log("✅ [Database] Message saved successfully to Firestore:", restResult.name);
        return { success: true, mode: 'firebase', docId: restResult.name };
    } catch (restErr) {
        console.warn("⚠️ REST API write had issue, attempting Firebase SDK:", restErr);

        // 3. Fallback to Firebase SDK if REST had network issue
        if (isFirebaseLive && db) {
            try {
                const docRef = await db.collection("messages").add({
                    ...newRecord,
                    serverTimestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log("✅ [Database] Message saved via Firestore SDK with ID:", docRef.id);
                return { success: true, mode: 'firebase', id: docRef.id };
            } catch (sdkErr) {
                console.error("❌ Both REST & SDK failed, stored in local database:", sdkErr);
                return { success: true, mode: 'local_fallback', error: sdkErr };
            }
        }

        return { success: true, mode: 'local_database' };
    }
}

/**
 * Retrieves all received messages (Firestore if connected, else LocalStorage)
 */
async function getStoredMessages() {
    // 1. Try REST API fetch
    const restDocs = await getFromFirestoreViaRest();
    if (restDocs && restDocs.length > 0) {
        return restDocs;
    }

    // 2. Try Firestore SDK
    if (isFirebaseLive && db) {
        try {
            const snapshot = await db.collection("messages").orderBy("serverTimestamp", "desc").get();
            const docs = [];
            snapshot.forEach(doc => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            if (docs.length > 0) return docs;
        } catch (err) {
            console.warn("Could not fetch from Firestore SDK, falling back to local:", err);
        }
    }

    // 3. Local storage fallback
    return JSON.parse(localStorage.getItem('sv_portfolio_messages') || '[]');
}

// Expose functions globally
window.saveContactMessage = saveContactMessage;
window.getStoredMessages = getStoredMessages;
window.isFirebaseLive = () => isFirebaseLive;
