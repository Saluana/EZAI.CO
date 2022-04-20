import { initializeApp } from 'firebase-admin/app';

initializeApp({
  credential: require(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: 'firebase-adminsdk-8qmlh@ezai-753ce.iam.gserviceaccount.com'
});

