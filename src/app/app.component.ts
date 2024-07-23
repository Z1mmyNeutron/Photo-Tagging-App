import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Strados Interview Round 2';

  navbar = [
    {  routerLink: "/fields", label: "Field"}
  ]
}
