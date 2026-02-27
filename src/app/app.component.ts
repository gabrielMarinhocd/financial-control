import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isMobile: boolean = false;

  ngOnInit() {
    this.onCheckMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.onCheckMobile(event);
  }

  onCheckMobile(event?: any) {
    const width = event?.target?.innerWidth || window.innerWidth;
    this.isMobile = width <= 768;
    // Opcional: log para debug
    console.log('Tela mobile?', this.isMobile, '| Largura:', width);
  }
}
