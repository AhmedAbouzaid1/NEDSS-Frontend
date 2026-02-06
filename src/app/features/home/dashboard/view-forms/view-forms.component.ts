import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DiseaseFormService } from '../components/disease-special-symptoms/services/disease-form.service';

@Component({
  selector: 'app-view-forms',
  templateUrl: './view-forms.component.html',
  styleUrls: ['./view-forms.component.css']
})
export class ViewFormsComponent implements OnInit {
form:any={};
formDto:any[]=[];
  constructor(
    private activatedRoute:ActivatedRoute,
   private userMsg: UserMessageService,
   private diseaseFormService: DiseaseFormService,
  ) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
this.activatedRoute.data.subscribe(
  (res)=>{

   this.form=(res.data.data);
   this.getFields();

    },
  (err)=>{this.userMsg.error("")}
);
  }

  getFields(){
    this.form.mainContainers.forEach(main => {
      main.subContainers.forEach(sub => {
        sub.controls.forEach(con => {
      this.formDto.push(con);
        })
      })
    });

  }
  OnValidForm(model:any){


    let modelDto=this.getModelSend(model);
    console.log(modelDto);
    // alert( JSON.stringify(modelDto) );

   }
   getModelSend(model:any){
    let modelArr:any=[];
     model.forEach((element:any) => {
         let item=this.formDto.filter((a:any)=>a.fieldName ===element.fieldName)[0];
         modelArr.push({
           questionId:item.id,
           questionAnswer:element.fieldValue,
       }
        )  });
        return modelArr;
   }
}
