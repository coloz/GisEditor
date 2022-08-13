
// 标记Marker / 线路Route / 地块Area

export interface GisItem {
    id: string,
    name: string,
    type?: GisItemType,
    addr: string,
    creator?: string,
    createTime: string,
    updateTime: string,
    path: any[],
    color?: string,
    removeState?: number,
}

export enum GisItemType {
    Marker = 'Marker',
    Route = 'Route',
    Area = 'Area',
}