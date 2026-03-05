import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PonyApp';
  readonly APIUrl = "http://localhost:5038/api/ponies/";

  ponies: any = [];
  editingPonyId: string | null = null;
  editPonyData: any = {};

  // NEW: Variable to hold our success message
  successMessage: string = '';

  ponyForm = new FormGroup({
    // Added minLength validation for the name
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    color: new FormControl('', Validators.required),
    ponyType: new FormControl('', Validators.required),
    elementOfHarmony: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshPonies();
  }

  refreshPonies() {
    this.http.get(this.APIUrl + 'GetPonies').subscribe(data => {
      this.ponies = data;
    });
  }

  // NEW: Helper method to show the banner and hide it after 3 seconds
  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  onSubmit() {
    if (this.ponyForm.invalid) {
      this.ponyForm.markAllAsTouched(); // This forces the red validation text to show
      return;
    }

    const formData = new FormData();
    formData.append("name", this.ponyForm.value.name!);
    formData.append("color", this.ponyForm.value.color!);
    formData.append("ponyType", this.ponyForm.value.ponyType!);
    formData.append("elementOfHarmony", this.ponyForm.value.elementOfHarmony!);

    this.http.post(this.APIUrl + 'AddPony', formData).subscribe(data => {
      this.ponyForm.reset({ name: '', color: '', ponyType: '', elementOfHarmony: '' });
      this.refreshPonies();
      this.showSuccess("✨ New pony recruited successfully!"); // Trigger success banner
    });
  }

  startEdit(pony: any) {
    this.editingPonyId = pony.id || pony._id;
    this.editPonyData = { ...pony, id: pony.id || pony._id };
  }

  cancelEdit() {
    this.editingPonyId = null;
    this.editPonyData = {};
  }

  saveEdit() {
    // Basic validation for the edit form
    if (!this.editPonyData.name || !this.editPonyData.color) return;

    const formData = new FormData();
    formData.append("id", this.editPonyData.id);
    formData.append("name", this.editPonyData.name);
    formData.append("color", this.editPonyData.color);
    formData.append("ponyType", this.editPonyData.ponyType);
    formData.append("elementOfHarmony", this.editPonyData.elementOfHarmony);

    this.http.put(this.APIUrl + 'UpdatePony', formData).subscribe(data => {
      this.editingPonyId = null;
      this.refreshPonies();
      this.showSuccess("✨ Pony updated successfully!"); // Trigger success banner
    });
  }

  deletePony(id: any) {
    if(confirm('Are you sure you want to banish this pony?')) {
      this.http.delete(this.APIUrl + 'DeletePony?id=' + id).subscribe(data => {
        this.refreshPonies();
        this.showSuccess("Pony banished from Equestria."); // Trigger success banner
      });
    }
  }
}
