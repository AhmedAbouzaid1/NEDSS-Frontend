import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DiseaseFormService } from '../disease-special-symptoms/services/disease-form.service';

@Component({
  selector: 'app-dynamic-form-design',
  templateUrl: './dynamic-form-design.component.html',
  styleUrls: ['./dynamic-form-design.component.css']
})
export class DynamicFormDesignComponent implements OnInit {
  dataBase:{};
  form?:any={};
  mainContainer: any = {};
  subContainer: any = {};
  controlSelected: any = {};
  properties: any[] = [
    {
      id: 1,
      name: 'color',
      type: 'color',
      labelAr: 'لون',
      labelEn: 'color',
    },
    {
      id: 17890,
      name: 'order',
      type: 'text',
      labelAr: 'الترتيب',
      labelEn: 'order',
    },
    {
      id: 298,
      name: 'border-width',
      type: 'text',
      labelAr: 'سمك الحدود',
      labelEn: 'border width',
    },
    {
      id: 257,
      name: 'border-color',
      type: 'color',
      labelAr: 'لون الحد',
      labelEn: 'border color',
    },

    {
      id: 3,
      name: 'background',
      type: 'color',
      labelAr: 'لون الخلفية',
      labelEn: 'background',
    },
    {
      id: 37098,
      name: 'padding',
      type: 'text',
      labelAr: 'الهوامش الداخلية',
      labelEn: 'padding',
    },
    {
      id: 37098,
      name: 'flex-direction',
      type: 'text',
      labelAr: 'الاتجاه',
      labelEn: 'direction',
    },
    {
      id: 3798098,
      name: 'align-items',
      type: 'text',
      labelAr: 'الاتجاه افقى',
      labelEn: 'direction',
    },
  ];
  controls: any[] = [
    { id: 1, type: 'text', nameEn: 'text', nameAr: 'نص' },
    { id: 2, type: 'radio', nameEn: 'select one', nameAr: 'اختيار من متعدد' },
    { id: 3, type: 'header', nameEn: 'header', nameAr: 'عنوان' },
  ];
  template: string = '';
  controlDrag: number = 0;
  formBuild:any={};
  formBase:any={};
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

   this.configData(res.data.data);

    },
  (err)=>{this.userMsg.error("")}
);
  }
  configData(data:any){
    this.formBase.id=data.id;
    this.formBase.diseaseGroupId=data.diseaseGroupId;
   this.formBase.nameAr=data.nameAr;
   this.formBase.nameEn=data.nameEn;
this.form=data.mainContainers;
  }
  openContainer(id: any, template: TemplateRef<any>) {
    this.subContainer = {};
    let main = this.form.find((main: any) =>  main.containers.some((c: any) => c.id === id)   );
    this.subContainer = main.containers.find((a: any) => a.id === id);
    this.template = 'sub';
  }
  openMainContainer(id: any, template: TemplateRef<any>) {
    this.mainContainer = {};
    this.mainContainer = this.form.find((c: any) => c.id === id);
    this.template = 'main';
  }
  deleteMainContainer(id: any) {
    this.diseaseFormService.deleteContainer(id).subscribe(
      (res)=>{ this.configData(this.configData(res.data)); this.userMsg.success("تم الحفظ بنجاح")},
      (err)=>{this.userMsg.success("فشل الحغظ")}
    );
    // let index = this.form.findIndex((c: any) => c.id === id);
    // this.form.splice(index, 1);
  }
  addControl(id: any) {
    this.subContainer = {};
    let main = this.form.find((main: any) =>
      main.subContainers.some((c: any) => c.id === id)
    );
  this.subContainer = main.subContainers.find((a: any) => a.id === id);
    this.subContainer.controls.push({
      id: Date.now(),
      type: 'text',
      label: 'test',
      properties: [],
    });
  }
  deleteSubContainer(id: any) {
    this.diseaseFormService.deleteContainer(id).subscribe(
      (res)=>{ this.configData(this.configData(res.data)); this.userMsg.success("تم الحفظ بنجاح")},
      (err)=>{this.userMsg.success("فشل الحغظ")}
    );
    // let main = this.form.find((main: any) =>
    //   main.subContainers.some((c: any) => c.id === id)
    // );
    // let index = main.subContainers.findIndex((a: any) => a.id === id);
    // main.subContainers.splice(index, 1);
  }

  getDynamicStyles(id: any) {
    let p = this.form.find((c: any) => c.id === id);
    return p.properties;
  }
  onControlProperty(id: any, template: TemplateRef<any>) {
    this.controlSelected = {};
    const form = this.form.find((item: any) =>
      item.containers.some((contact: any) =>
        contact.controls.some((control: any) => control.id === id)
      )
    );
       const form2 = form.subContainers.find((item: any) =>
      item.controls.some((control: any) => control.id === id)
    );
    this.controlSelected = form2.controls.find((a: any) => a.id === id);
    this.template = 'control';
     // this.modalRef = this.modalService.show(template, this.config);
  }
  onControlDelete(id: any) {
     const form = this.form.find((item: any) =>  item.subContainers.some((contact: any) =>   contact.controls.some((address: any) => address.id === id)   ) );
    const container = form.subContainers.find((item: any) =>
    item.controls.some((address: any) => address.id === id)
    );
   let index = container.controls.findIndex((a: any) => a.id === id);
    container.controls.splice(index, 1);
  }

  OnAddMainContainer() {
  this.diseaseFormService.AddMianContainer(this.formBase.id).subscribe(
    (res)=>{ this.configData(this.configData(res.data)); this.userMsg.success("تم الحفظ بنجاح")},
    (err)=>{this.userMsg.success("فشل الحغظ")}
  );

  }
  addSubContainer(id: any) {

   this.diseaseFormService.AddSubContainer(this.formBase.id,id).subscribe(
    (res)=>{ this.configData(this.configData(res.data)); this.userMsg.success("تم الحفظ بنجاح")},
    (err)=>{this.userMsg.success("فشل الحغظ")}
  );
  }
  onSubmitForm() {
    let model:any={};
      model.id=this.formBase.id;
    model.nameAr=this.formBase.nameAr;
    model.nameEn=this.formBase.nameEn;
    model.diseaseGroupId=this.formBase.diseaseGroupId;
   model.mainContainers=this.form;

     this.diseaseFormService.update(model).subscribe(
      (res)=>{this.userMsg.success("تم الحفظ بنجاح")},
      (err)=>{this.userMsg.success("فشل الحغظ")}
    );

 }
  drag(id: any) {
    this.controlDrag = id;
  }
  dropControl(event: any) {
    event.preventDefault();
    const id = <number>event.target?.id;
    this.subContainer = {};
    let main = this.form.find((main: any) =>
      main.containers.some((c: any) => c.id == id)
    );
    this.subContainer = main.containers.find((a: any) => a.id == id);
    let control = this.controls.find((a: any) => a.id == this.controlDrag);
    this.subContainer.controls.push({
      id: Date.now(),
      type: control.type,
      label: 'test',
      properties: [],
    });
  }
  allowDrop(event: any) {
    event.preventDefault();
  }
  trackByFn(index: number, item: any) {
    return item.id;
  }

}
