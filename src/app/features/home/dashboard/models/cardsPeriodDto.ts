import { CardsPeriodDurationUnitEnum } from "src/app/enums/CardsPeriodDurationUnitEnum";
import { CardsPeriodTypeEnum } from "src/app/enums/CardsPeriodTypeEnum";

export interface CardsPeriodDto {
    CardPeriodType: CardsPeriodTypeEnum;
    CardsPeriodDurationUnit: CardsPeriodDurationUnitEnum;
    CardsPeriodDurationValue: number;
    CardsPeriodFromDate: string;
    CardsPeriodToDate: string;
    InvestigationPercentage: number;
}
