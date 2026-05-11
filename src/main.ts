import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app/shared/material/material.module';
import { provideServiceWorker } from '@angular/service-worker';

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  ...appConfig, 
  providers: [
    ...appConfig.providers ?? [],
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    importProvidersFrom(BrowserAnimationsModule, MaterialModule),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
}).catch((err) => console.error(err));