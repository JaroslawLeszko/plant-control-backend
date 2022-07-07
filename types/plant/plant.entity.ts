export interface PlantEntity {
    id?: string;
    name: string;
    lastWatering: string;
    wateringPeriod: number;
    lastFertilization: string;
    fertilizationPeriod: number;
    lastDustRemoval: string;
    quarantine?: number;
    image?: string;
}