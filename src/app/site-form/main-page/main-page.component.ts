import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpDataService } from '../../services/http-data.service';
import { SurveyComponent } from '../survey/survey.component';
import * as SurveyPDF from "survey-pdf";
import { confirm } from 'devextreme/ui/dialog';


export class Category {
  id: number;
  text: string;
  templateId: number;
  parentId: number;
  result: any;
  children?: number;
}
export class Result {
  templateId: number;
  categoryId: number;
  result: any;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild(SurveyComponent) survey: SurveyComponent;
  description = true;
  questionnaire = false;
  itemType = 'empty';
  categories: Category[] = new Array();
  templateId: any;
  selectedNode: any;
  results: any;
  categoryId: any;
  selectedNodeId: any;
  parentCategory: string;
  childCategory: string;
  jsonData: string;
  selectedRowKeys: number[];
  expandedRowKeys: number[] = new Array();
  title: string;
  deleteDisabled = false;
  constructor(private service: HttpDataService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getResults();
  }
  getCategories() {
    this.service.getCategories().subscribe((response) => {
      this.categories = response;
    });
  }

  getResults() {
    this.service.getResults().subscribe((response) => {
      this.results = response;
    });
  }
  selectItem(e) {
    
    console.log(e);
    this.selectedNode = e.data;
    this.itemType = '';

    if (e.data) {
      if (e.data.parentId === -1) {
        this.expandedRowKeys = [e.key];
        this.parentCategory = e.data.text;
        this.title = e.data.text;
        this.childCategory = '';
        this.description = true;
        this.questionnaire = false;
        this.templateId = e.data.templateId;
      } else if (e.data.parentId > -1) {
        this.parentCategory = this.categories.find(w => w.id === e.data.parentId).text;
        this.childCategory = e.data.text;
        this.questionnaire = true;
        this.description = false;
        this.templateId = e.data.templateId;
        this.selectedNodeId = e.data.id;
        this.survey.selectResult(this.templateId, e.data.id);
        this.getQuestionnairJson(this.templateId);
      }
    }
    
  }
  getQuestionnairJson(e): any {
    this.service.getCategoryItem(e).subscribe((response) => {
      this.jsonData = response;
    });
  }
  saveResult(result: Result) {
    this.service.saveResult(result).subscribe((response) => {
      this.getCategories();
    });
  }

  updateCategory(id: number, result: any) {
    this.service.updateCategory(id, result).subscribe((response) => {
      this.getCategories();
    });
  }
  saveQuiz() {
    let result = JSON.stringify(this.survey.surveyModel.getAllValues());
    if (this.selectedNode.parentId === -1) {
      const categoryId = this.categories[this.categories.length - 1].id + 1;
      const firstQuestion = this.survey.surveyModel.getAllQuestions()[0];
      if (firstQuestion) {
        this.createCategory(firstQuestion.name, categoryId, result);
      }
      this.setParentSelection(this.selectedNode);
      this.deleteDisabled = false;

    } else {
      let node = this.selectedNode;
      node.result = result;
      this.updateCategory(node.id, node);
    }

  }
  addRecord() {
    this.questionnaire = true;
    this.description = false;
    this.survey.selectQuestionnaire(this.templateId);
    this.deleteDisabled = true;

  }
  createCategory(question: string, categoryId: number, result: string) {
    const indx = this.categories.find(w => w.templateId === this.templateId);
    if (indx) {
      let category = new Category();
      category.id = categoryId;
      category.text = this.survey.surveyModel.getValue(question);
      category.parentId = indx.id;
      category.templateId = this.templateId;
      category.result = result;
      this.service.createCategory(category).subscribe((response) => {
        this.getCategories();
      });
    }
  }
  deleteQuiz() {

    const result = confirm('<span style=\'text-align:center\'><p>This will <b>Delete</b> the Questionnaire' +
      '. <br><br> Do you wish to continue?</p></span>', 'Confirm changes');
    result.then((dialogResult: boolean) => {
      if (dialogResult) {
        if (this.selectedNode) {
          const parent = this.categories.find(p => p.id === this.selectedNode.parentId);
          const id = this.selectedNode.id;
          this.service.deleteCategory(id).subscribe((response) => {
            this.getCategories();
            this.parentCategory = '';
            this.childCategory = '';
            this.setParentSelection(parent);
          });
        }
      }
    });
  }
  finishClicked() {
    /*
    const result = confirm('<span style=\'text-align:center\'><p>This will <b>Delete</b> the Questionnaire' +
    '. <br><br> Do you wish to continue?</p></span>', 'Confirm changes');
  result.then((dialogResult: boolean) => {
    if (dialogResult) {
    }
  });
*/
    this.saveQuiz();
    var options = {
      fontSize: 14,
      margins: {
        left: 10,
        right: 10,
        top: 18,
        bot: 10
      }
    };
    var surveyPDF = new SurveyPDF.SurveyPDF(this.jsonData, options);
    surveyPDF.data = this.survey.surveyModel.data;
    surveyPDF.onRenderHeader.add(function (_, canvas) {
      canvas.drawText({
        text:
          "",
        fontSize: 10
      });
    });
    surveyPDF.save();
  }
  setParentSelection(selectedNode: any) {
    this.selectedRowKeys = [selectedNode.id];
    this.parentCategory = selectedNode.text;
    this.childCategory = '';
    this.description = true;
    this.questionnaire = false;
    this.title = selectedNode.text;
    this.templateId = selectedNode.templateId;
  }
}
