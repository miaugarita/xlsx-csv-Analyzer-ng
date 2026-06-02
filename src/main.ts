import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/csv-upload/csv-upload';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
