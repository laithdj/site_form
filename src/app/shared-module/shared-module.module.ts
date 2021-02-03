import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';
import { DxTextBoxModule, DxFormModule, DxCheckBoxModule, DxButtonModule, DxDataGridModule, DxRadioGroupModule,
  DxSelectBoxModule, DxPopupModule, DxDateBoxModule, DxTreeListModule, DxTreeViewModule, DxLoadIndicatorModule } from 'devextreme-angular';
import dxLoadIndicator from 'devextreme/ui/load_indicator';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DxTextBoxModule,
    DxFormModule,
    DxCheckBoxModule,
    DxButtonModule,
    DxPopupModule,
    DxDataGridModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxTreeListModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxTreeViewModule,
    DxLoadIndicatorModule
    
  ],
  exports: [
    CommonModule,
    DxTextBoxModule,
    DxFormModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxTreeListModule,
    DxCheckBoxModule,
    DxButtonModule,
    DxPopupModule,
    DxDataGridModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxTreeViewModule,
    DxDateBoxModule,
    DxLoadIndicatorModule
  ],
})
export class SharedModule { 
  public static forRoot(): ModuleWithProviders {
    return { ngModule: SharedModule };
  }
}
