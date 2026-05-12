import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './shared/material/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isMobile: boolean = false;

  deferredPrompt: any = null;
  isInstalled = false;

  ngOnInit() {
    this.onCheckMobile();
    this.initPWA();
  }

  initPWA() {
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.deferredPrompt = event;
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
    });

    this.checkStandalone();
  }

  checkStandalone() {
    this.isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
  }

  installPWA() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice.then(() => {
      this.deferredPrompt = null;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.onCheckMobile(event);
  }

  onCheckMobile(event?: any) {
    const width = event?.target?.innerWidth || window.innerWidth;
    this.isMobile = width <= 768;
  }
}
