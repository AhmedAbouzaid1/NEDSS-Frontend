export enum DiseaseGroupQuestionType {
    Text = 1,
    Number = 2,
    RadioButton = 3,
    CheckBox = 4,
    DropDownList = 5,
    DateAndTime = 6,
    DateOnly = 7,
}

export const DiseaseGroupQuestionTypeList = [
    { id: DiseaseGroupQuestionType.Text, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.text' },
    { id: DiseaseGroupQuestionType.Number, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.number' },
    { id: DiseaseGroupQuestionType.RadioButton, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.radio' },
    { id: DiseaseGroupQuestionType.CheckBox, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.checkBox' },
    { id: DiseaseGroupQuestionType.DropDownList, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.list' },
    { id: DiseaseGroupQuestionType.DateAndTime, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.dateTime' },
    { id: DiseaseGroupQuestionType.DateOnly, name: 'NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.date' }
]