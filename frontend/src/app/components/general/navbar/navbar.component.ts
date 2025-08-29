import { Component, Injectable, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

@Injectable({
  providedIn: 'root'
})

export class NavbarComponent implements OnInit {

  ngOnInit(): void {
      
  }

  @Input() menuItems: string[] = [
    "HOME", "JUNIOR SECONDARY", "PRIMARY", "ABOUT US", "CONTACT US"
  ];

  

}

