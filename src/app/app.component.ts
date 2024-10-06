import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './services/flowbite/flowbite.service';
import { NgClass } from '@angular/common';
import { LocalStorageService } from './services/localStorage/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Fixed styleUrls
})
export class AppComponent implements OnInit {
  title = 'Dynamic Slider';

  images: any[] = [];
  preview: any = '';
  imageIndex!: number;

  constructor(
    private readonly _FlowbiteService: FlowbiteService,
    private _LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite((flowbite) => {
      console.log('FLOWBITE loaded', flowbite);
    });

    const storedImages = this._LocalStorageService.getItem('images'); // Fixed key
    if (storedImages) {
      this.images = storedImages;
    }

    const storedIndex = this._LocalStorageService.getItem('imageIndex');
    this.imageIndex = storedIndex !== undefined ? storedIndex : 0;

    this.showDefaultImage();
  }

  getImages(event: any) {
    let files = event.target.files;

    let limit = Math.min(7 - this.images.length, files.length); // Fixed logic
    for (let i = 0; i < limit; i++) {
      let file = files[i];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        let result = fileReader.result;

        if (!this.images.includes(result)) {
          this.images.push(result);
          this.updateLocalStorage();
          this.showDefaultImage();
        }
      };
    }
  }

  updateLocalStorage() {
    this._LocalStorageService.setItem('images', this.images);
    this._LocalStorageService.setItem('imageIndex', this.imageIndex); // Save imageIndex
  }

  clearImages() {
    this._LocalStorageService.clear();
    this.images.length = 0;
    this.preview = '';
  }

  displayImage(index: number) {
    this.imageIndex = index;
    this.preview = this.images[index];
    this.updateLocalStorage();
  }

  deleteImage() {
    if (this.images.length > 0) {
      this.images.splice(this.imageIndex, 1);
      this.updateLocalStorage();

      if (this.images.length === 0) {
        this.preview = ''; // Reset preview if no images are left
      } else {
        this.imageIndex = Math.min(this.imageIndex, this.images.length - 1);
        this.preview = this.images[this.imageIndex];
      }
    }
  }

  backImage() {
    if (this.imageIndex > 0) {
      this.imageIndex--;
    } else {
      this.imageIndex = this.images.length - 1;
    }
    this.preview = this.images[this.imageIndex];
    this.updateLocalStorage();
  }

  forwardImage() {
    this.imageIndex++;
    if (this.imageIndex >= this.images.length) {
      this.imageIndex = 0;
    }
    this.preview = this.images[this.imageIndex];
    this.updateLocalStorage();
  }

  showDefaultImage() {
    if (this.images.length > 0) {
      this.preview = this.images[this.imageIndex];
    } else {
      this.preview = ''; // Reset if no images available
    }
  }
}
