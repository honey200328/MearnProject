import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, Item } from './app/services/item.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>MEAN Stack Application</h1>
      
      <div class="items-list">
        <h2>Items List</h2>
        <div *ngIf="items.length === 0" class="no-items">
          No items available. Add your first item below!
        </div>
        <ul>
          <li *ngFor="let item of items; trackBy: trackById" [class.highlight]="item.id === lastAddedId">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-id">#{{ item.id }}</span>
          </li>
        </ul>
      </div>

      <div class="add-item">
        <h2>Add New Item</h2>
        <form (ngSubmit)="addItem()" #itemForm="ngForm">
          <input 
            type="text" 
            [(ngModel)]="newItemName" 
            name="itemName"
            placeholder="Enter item name"
            [disabled]="isSubmitting"
            required
          >
          <button type="submit" [disabled]="!newItemName.trim() || isSubmitting">
            {{ isSubmitting ? 'Adding...' : 'Add Item' }}
          </button>
        </form>
      </div>

      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .items-list {
      margin: 20px 0;
    }
    .no-items {
      text-align: center;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 4px;
      color: #6c757d;
    }
    .add-item {
      margin-top: 20px;
    }
    input {
      padding: 8px;
      margin-right: 10px;
      width: 200px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      transition: border-color 0.15s ease-in-out;
    }
    input:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
    input:disabled {
      background-color: #e9ecef;
      cursor: not-allowed;
    }
    button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
      min-width: 100px;
    }
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    button:not(:disabled):hover {
      background-color: #0056b3;
    }
    ul {
      padding: 0;
    }
    li {
      background-color: #f8f9fa;
      padding: 12px;
      margin: 8px 0;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }
    li.highlight {
      background-color: #e8f4ff;
      border-color: #b8daff;
      animation: fadeIn 0.5s ease-out;
    }
    .item-name {
      font-weight: 500;
    }
    .item-id {
      color: #6c757d;
      font-size: 0.9em;
    }
    .success-message {
      margin-top: 20px;
      padding: 10px;
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      animation: fadeIn 0.3s ease-out;
    }
    .error-message {
      margin-top: 20px;
      padding: 10px;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ItemService]
})
export class App implements OnInit {
  items: Item[] = [];
  newItemName: string = '';
  error: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  lastAddedId: number | null = null;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.error = '';
    this.itemService.getItems().subscribe({
      next: (items) => {
        console.log('Received items:', items);
        this.items = items;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.error = 'Failed to load items. Please try again.';
      }
    });
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }

  addItem() {
    if (this.newItemName.trim() && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = '';
      this.successMessage = '';
      console.log('Adding item:', this.newItemName);
      
      this.itemService.addItem({ name: this.newItemName.trim() }).subscribe({
        next: (newItem) => {
          console.log('Successfully added item:', newItem);
          this.lastAddedId = newItem.id;
          this.items.push(newItem);
          this.newItemName = '';
          this.successMessage = `Successfully added "${newItem.name}"`;
          this.isSubmitting = false;

          // Clear success message after 3 seconds
          setTimeout(() => {
            if (this.successMessage.includes(newItem.name)) {
              this.successMessage = '';
            }
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding item:', error);
          this.error = 'Failed to add item. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));