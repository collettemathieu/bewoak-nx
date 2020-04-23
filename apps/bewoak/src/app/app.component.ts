import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/user/auth.service';

@Component({
  selector: 'bw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Tente de se connecter automatiquement
    this.authService.automaticLogin();
  }
}
