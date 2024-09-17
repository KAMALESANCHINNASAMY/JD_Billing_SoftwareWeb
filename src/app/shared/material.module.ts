import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const modules = [
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatCardModule,
  MatToolbarModule,
  MatTabsModule,
  MatDialogModule,
  MatSelectModule,
  MatMenuModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatRadioModule,
  MatChipsModule,
  MatTableModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
];
@NgModule({
  imports: [...modules],
  exports: [...modules],
  declarations: [],
})
export class MaterialModule {}
