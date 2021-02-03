import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'description-page',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  @Output() addClicked: EventEmitter<void> = new EventEmitter();
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }
  onAddClicked() {
    this.addClicked.emit();
  }

}
