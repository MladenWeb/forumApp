import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { NavbarComponent } from './navbar/navbar.component';
@NgModule({
  declarations: [TreeViewComponent, NavbarComponent],
  exports: [TreeViewComponent, NavbarComponent],
  imports: [CommonModule],
})
export class SharedModule {}
