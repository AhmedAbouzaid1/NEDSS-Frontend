export class HelpModel {
      id: number;
      mainBranchId: number;
      content: string;
      patientJobID: number;
      title: string;
      optionHelpAttachments: [
        {
          announcementId: number,
          fileName: string,
          fileType: string,
          path: string
        }
      ];
      totalCount: number
  }
