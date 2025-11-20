import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataBinding } from './data-binding-demo/data-binding-demo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DataBinding],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('prelim_lab_data_binding');
}
