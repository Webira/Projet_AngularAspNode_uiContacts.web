import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  //title = 'contacts.web';
  http = inject(HttpClient);
  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false),
  });

  contacts$ = this.getContacts();
  // methode
  onFormSubmit() {
    //console.log(this.contactsForm.value);
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite,
    };
    this.http
      .post('https://localhost:7096/api/Contacts', addContactRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.contacts$ = this.getContacts();
          this.contactsForm.reset();
        },
      });
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7096/api/Contacts/${id}`).subscribe({
      next: (value) => {
        alert('Item deleted');
        this.contacts$ = this.getContacts();
      },
    });
  }

  //constructor
  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7096/api/Contacts');
  }
}

/* ----version CHATGPT--------

interface Contact {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  contacts$: Observable<Contact[]>;

  constructor(private http: HttpClient) {
    this.contacts$ = this.http.get<Contact[]>('api/contacts');
  }
}*/
