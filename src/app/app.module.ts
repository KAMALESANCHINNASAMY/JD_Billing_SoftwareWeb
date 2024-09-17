import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AppRoutingModule, pageComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { MaterialModule } from './shared/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { UserComponent } from './user/user.component';
import { CompanyComponent } from './company/company.component';
import {NgxPrintModule} from 'ngx-print';
import { LoadingspinnerComponent } from "./master/loadingspinner/loadingspinner.component";



@NgModule({
    declarations: [AppComponent, ...pageComponents, UserComponent, CompanyComponent],
    exports: [NgxDropzoneModule],
    providers: [
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        DashboardModule,
        MatSlideToggleModule,
        FormsModule,
        MatTableModule,
        NgxDropzoneModule,
        MatPaginatorModule,
        MatCheckboxModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxPrintModule,
        SimpleNotificationsModule.forRoot(),
        LoadingspinnerComponent
    ]
})
export class AppModule { }
