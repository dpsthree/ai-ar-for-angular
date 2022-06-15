import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CanvasRendererComponent } from './canvas-renderer/canvas-renderer.component';

@NgModule({
  declarations: [AppComponent, CanvasRendererComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
