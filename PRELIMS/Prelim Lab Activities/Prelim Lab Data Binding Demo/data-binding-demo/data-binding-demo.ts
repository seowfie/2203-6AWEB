

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-data-binding',
  imports: [FormsModule],
  templateUrl: './data-binding-demo.html',
  styleUrl: './data-binding-demo.css',
})
export class DataBinding {
  title = "Sofia's First App"
  description = "This is my new Angular Application"

  imageUrl = '../assets/seb.webp';
  w = 500;
  h = 300;
  altText = 'Winter Soldier';

  textColor='pink';

  isHighlighted = true;

  yourName = '';

  count = 0;
  increment() {
    this.count++;
  }
  decrement() {
    this.count--;
  }
}
