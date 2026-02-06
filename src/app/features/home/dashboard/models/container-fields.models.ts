export enum QuestionType {
    MCQ = 1,
    MultiChoice = 2,
    TrueOrFalse = 3,
    Emoji = 4,
    DropdownList = 5
}

export const QustionTypesLookups = [
    { id: null, name: "NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.Select" },
    { id: QuestionType.MCQ, name: "NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.checkBox" },
    { id: QuestionType.MultiChoice, name: "NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.MultipleChoice" },
    { id: QuestionType.TrueOrFalse, name: "NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.TrueOrFalse" },
    // { id: QuestionType.Emoji, name: "NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.Emoji" },
    { id: QuestionType.DropdownList, name: "NEDSS.HOME.CONTROL_PANEL.SPECIAL_SYMPTOMS_ADD.list" },
]