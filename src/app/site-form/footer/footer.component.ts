import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Output() saveClicked: EventEmitter<void> = new EventEmitter();
  @Output() deleteClicked: EventEmitter<void> = new EventEmitter();
  @Output() finishClicked: EventEmitter<void> = new EventEmitter();
  @Output() addClicked: EventEmitter<void> = new EventEmitter();

  @Input() deleteDisabled: boolean;
  @Input() newRecord: boolean;
  @Input() title: boolean;



  constructor() { }

  ngOnInit(): void {
  }
  onSaveClicked() {
    this.saveClicked.emit();
  }
  onFinishClicked() {
    this.finishClicked.emit();
  }
  onDeleteClicked() {
    this.deleteClicked.emit();
  }
  onAddClicked() {
    this.addClicked.emit();
  }
}
