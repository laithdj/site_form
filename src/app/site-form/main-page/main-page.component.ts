import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpDataService } from '../../services/http-data.service';
import { SurveyComponent } from '../survey/survey.component';
import * as SurveyPDF from "survey-pdf";
import { confirm } from 'devextreme/ui/dialog';
import * as Survey from "survey-angular";
import { DomSanitizer } from '@angular/platform-browser';


export class Category {
  id: number;
  text: string;
  templateId: number;
  parentId: number;
  result: any;
  children?: number;
  html?: string;
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
  title: any;
  deleteDisabled = false;
  uniqJsonCount = 0;
  jsonDatas: any[] = new Array();
  showAddRecord = true;
  selected: boolean;
  constructor(private service: HttpDataService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getCategories();
    this.getResults();
    this.getQuestionnairJsons();

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
    this.selectedNode = e.data;
    this.itemType = '';
    this.selected = true;
    if (e.data) {
      if (e.data.parentId === -1) {
        this.expandedRowKeys = [e.key];
        this.parentCategory = e.data.text;
        this.title = e.data.html ? this.sanitizer.bypassSecurityTrustHtml(e.data.html) : null;
        this.childCategory = '';
        this.description = true;
        this.showAddRecord = true;
        this.questionnaire = false;
        this.templateId = e.data.templateId;
      } else if (e.data.parentId > -1) {
        this.parentCategory = this.categories.find(w => w.id === e.data.parentId).text;
        this.childCategory = e.data.text;
        this.questionnaire = true;
        this.description = false;
        this.showAddRecord = false;
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
  getQuestionnairJsons(): any {
    this.service.getCategoryItems().subscribe((response) => {
      this.jsonDatas = response;
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
    this.showAddRecord = false;

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
  makeQuesionNamesUnique(json) {
    for (let i = 0; i < json.pages[0].elements.length; i++) {
      json.pages[0].elements[i].name += "_uniqJsonCount" + this.uniqJsonCount;
    }
    this.uniqJsonCount++;
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
    let surveyModels: any[] = new Array();
    let jsons: any[] = new Array();
    // get api takes categoryId
    this.categories.forEach(j => {
      if (j.parentId > -1) {
        let q = this.jsonDatas.find(p => p.id === j.templateId);

        if (q) {
          jsons.push(q);
          this.makeQuesionNamesUnique(q);
          let surveyModel = new Survey.Model(q);
          surveyModel.data = JSON.parse(j.result);
          surveyModels.push(surveyModel);
        }
      }
    });

    let list = '';
    this.categories.forEach(element => {
      if (element.parentId === -1) {
        const hasChildren = this.categories.find(p => p.parentId === element.id);
        if (hasChildren) {
          list = list + '<b>' + element.text + '</b>' + '<br>';
          this.categories.forEach(child => {
            if (child.parentId === element.id) {
              list = list + child.text + '<br>';
            }
          });
        }
      }
    });
    const result = confirm('<span style=\'text-align:center\'><p>The following forms will be exported as PDF and will be sent to support via Email.' +
      '<br><br> Here is a summary of the completed forms:<br><br>' + list +
      '<br>Do you wish to continue?<p></span>', 'Confirm');
    result.then((dialogResult: boolean) => {
      if (dialogResult) {
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
        let json = {
          "pages": []
        };
        for (let i = 0; i < jsons.length; i++) {
          json.pages.push(jsons[i].pages[0]);
        }

        var surveyPDF = new SurveyPDF.SurveyPDF(json, options);
        let data = {};
        for (let i = 0; i < surveyModels.length; i++) {
          data = Object.assign(data, surveyModels[i].data);
        }
        surveyPDF.data = data;
        surveyPDF.onRenderHeader.add(function (_, canvas) {
          canvas.drawText({
            text:
              "",
            fontSize: 10
          });
        });
        surveyPDF.save();
      }
    });
  }
  setParentSelection(selectedNode: any) {
    this.selectedRowKeys = [selectedNode.id];
    this.parentCategory = selectedNode.text;
    this.childCategory = '';
    this.description = true;
    this.showAddRecord = true;
    this.questionnaire = false;
    this.title = selectedNode.html ? this.sanitizer.bypassSecurityTrustHtml(selectedNode.html) : null;
    this.templateId = selectedNode.templateId;
  }
}
