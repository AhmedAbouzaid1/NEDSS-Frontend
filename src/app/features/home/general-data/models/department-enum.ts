export enum DepartmentEnum {
    Internal = 1,
    External = 2,
    ICU = 18
}

export function isInternalLikeDepartment(departmentId: any): boolean {
    const id = Number(departmentId);
    return id === DepartmentEnum.Internal || id === DepartmentEnum.ICU;
}
