import { Component, Input, EventEmitter, Output, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as Survey from "survey-angular";
import { init as initCustomWidget } from "../customwidget/customwidget.component"
import { Router } from '@angular/router';
import { HttpDataService } from '../../services/http-data.service';
import * as widgets from "surveyjs-widgets";

export class Result {
  questionName: string;
  questionResult: any;
  referenceId: any;
}
export class Results {
  id?: number;
  result: Result[];
}


Survey.JsonObject.metaData.addProperty("questionbase", "referenceId:number");
/*
SurveyKo.JsonObject.metaData.addProperty(
  "questionbase",
  { name: "referenceId:dropdown", default: "default", colCount: 0, choices: 
  ["First Name (17003)",
   "Surname (17004)",
   "Status (17005)",
   "Patient ID (17006)",
   "Gender (17007)",
  ] }
);
*/
Survey.StylesManager.applyTheme("default");

@Component({
  // tslint:disable-next-line:component-selector
  selector: "survey-page",
  templateUrl: "./survey.component.html",
  styleUrls: ['./survey.component.css']

})
export class SurveyComponent implements OnInit , AfterViewInit{
  surveyModel: Survey.Survey;
  results: any;
  loader = false;
  navigatePages = false;
  constructor(private service: HttpDataService, private router: Router) { }
  @Output() surveyResults = new EventEmitter<any>();
  @Input() questionnaireId: number;

  title = "SurveyJS+Angular Demo Application";
  list: any[];
  json: any;
  result: any;
  selectedItem: any;
  res: Result[] = new Array()

  ngOnInit() {
   // this.populateList();
   this.selectQuestionnaire(this.questionnaireId);

  }
  ngAfterViewInit(){
    widgets.icheck(Survey);
    widgets.select2(Survey);
    widgets.inputmask(Survey);
    widgets.jquerybarrating(Survey);
  //  widgets.jqueryuidatepicker(Survey);
    widgets.nouislider(Survey);
    widgets.select2tagbox(Survey);
    //widgets.signaturepad(Survey);
    widgets.sortablejs(Survey);
    // widgets.ckeditor(Survey);
    widgets.autocomplete(Survey);
    widgets.bootstrapslider(Survey);
    widgets.prettycheckbox(Survey);
    //widgets.emotionsratings(Survey);
    initCustomWidget(Survey);
  }
  populateList() {
    this.service.getList().subscribe((response) => {
      this.list = response;
    });
  }

  selectQuestionnaire(e: number, showResult?:boolean) {
    this.loader = true;
    if (e) {
      this.service.getCategoryItem(e).subscribe((response) => {
        this.loadQuestionnaire(response,showResult);
      });
    }
  }
  selectResult(e: number, categoryId:string) {
    this.loader = true;
    if (e) {
      this.service.getCategoryItem(e).subscribe((response) => {
        this.loadQuestionnaire(response,true,categoryId);
      });
    }
  }


  loadQuestionnaire(json: any,showResult?:boolean,categoryId?:string) {

    const surveyModel = new Survey.Model(json);
    this.surveyModel = surveyModel;
    console.log(surveyModel.data);
    if(showResult === true){

      // get api takes categoryId
      this.service.getCategory(categoryId).subscribe((response) => {
        surveyModel.data = JSON.parse(response.result);

      });
    }
    surveyModel.surveyId = '_' + Math.random().toString(36).substr(2, 9);
    surveyModel.show = true;
    surveyModel.showNavigationButtons = false;
    if(surveyModel.pageCount > 1){
      this.navigatePages = true;
    }else{
      this.navigatePages = false;
    }
    Survey.SurveyNG.render("surveyElement", { model: surveyModel , css: myCss });
    this.loader = false;
  //loader false
  }
  modifySurveyResults(survey, id) {
    let resultData: Results = new Results();
    resultData.result = new Array();
    for (var key in survey.data) {
      let result: Result = new Result();
      var question = survey.getQuestionByValueName(key);

      if (!!question) {
        if (question.title) {
          result.questionName = question.title;
        }
        if (question.displayValue) {
          result.questionResult = question.displayValue;
        }
        if (question.referenceId) {
          result.referenceId = question.referenceId;
        }
        resultData.id = id;
        resultData.result.push(result);
      }
    }
    this.service.saveResult(resultData).subscribe((response) => {
      console.log(response);
    });

    //  this.service.res = resultData;
    /// this.res = resultData;
    return resultData;
  }

  deleteQuestionnaire() {
    if (this.selectedItem) {
      this.service.deleteItem(this.selectedItem).subscribe((response) => {
        this.loadQuestionnaire(response);
        this.populateList();

      });
    }
  }
  nextPage(){
    this.surveyModel.nextPage();
  }
  prevPage(){
    this.surveyModel.prevPage();
  }  
}