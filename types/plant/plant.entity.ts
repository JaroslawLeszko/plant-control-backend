export interface PlantEntity {
    id?: string,
    name: string,
    lastWatering: string,
    wateringPeriod: string,
    lastFertilization: string,
    fertilizationPeriod: string,
    lastDustRemoval: string,
    quarantine?: boolean,
    image?: string,
}