const Firebase = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-analytics.js"></script>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            var firebaseConfig = {
              apiKey: "${process.env.FIREBASE_API_KEY}",
              authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
              databaseURL: "${process.env.FIREBASE_DB_URL}",
              projectId: "${process.env.FIREBASE_PROJECT_ID}",
              storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
              messagingSenderId: "${process.env.FIREBASE_MSG_SENDER_ID}",
              appId: "${process.env.FIREBASE_APP_ID}",
              measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
            };

            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
          `,
        }}
      />
    </>
  )
}

export default Firebase
