import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from 'src/app/api-service/loadingSpinner.service';

@Component({
  selector: 'app-loadingspinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loadingspinner.component.html',
  styleUrl: './loadingspinner.component.scss'
})
export class LoadingspinnerComponent {
  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) { }
  ngOnInit(): void { }
}
