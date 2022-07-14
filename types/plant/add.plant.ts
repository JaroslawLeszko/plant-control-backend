import {PlantEntity} from "./plant.entity";

export type AddPlant = Omit<PlantEntity, `id`>;