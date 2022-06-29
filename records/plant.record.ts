import {PlantEntity} from "../types";

export class PlantRecord implements PlantEntity {
    id?: string;
    name: string;
    lastWatering: string;
    wateringPeriod: string;
    lastFertilization: string;
    fertilizationPeriod: string;
    lastDustRemoval: string;
    quarantine?: boolean;
    image?: string;

    constructor(obj: PlantEntity) {

        this.id =obj.id;
        this.name = obj.name;
        this.lastWatering = obj.lastWatering;
        this.wateringPeriod = obj.wateringPeriod;
        this.lastFertilization = obj.lastFertilization;
        this.fertilizationPeriod = obj.fertilizationPeriod;
        this.lastDustRemoval = obj.lastDustRemoval;
        this.quarantine = obj.quarantine;
        this.image = obj.image;
    }
}