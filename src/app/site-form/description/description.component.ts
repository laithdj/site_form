import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'description-page',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  @Output() addClicked: EventEmitter<void> = new EventEmitter();
  @Input() title: any;

  constructor() { }

  ngOnInit(): void {
  console.log(this.title);
  }
  onAddClicked() {
    this.addClicked.emit();
  }

}
