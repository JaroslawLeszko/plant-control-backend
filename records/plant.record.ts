import {PlantEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";
import {pool} from "../utils/db";

type PlantRecordResult = [PlantRecord[], FieldPacket[]];

export class PlantRecord implements PlantEntity {
    id?: string;
    name: string;
    lastWatering: string;
    wateringPeriod: number;
    lastFertilization: string;
    fertilizationPeriod: number;
    lastDustRemoval: string;
    quarantine?: number;
    image?: string;

    constructor(obj: PlantEntity) {

        if (!obj.name || obj.name.length < 3 || obj.name.length > 40) {
            throw new ValidationError('Name must be between 3 and 40 characters.');
        }

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

    static async listAll(): Promise<PlantEntity[]> {
        const [result] = await pool.execute("SELECT * FROM `plants`") as PlantRecordResult;

        return result.map(obj => new PlantRecord(obj));
    }

    static async getOne(id: string): Promise<PlantRecord | null> {
        const [result] = await pool.execute("SELECT * FROM `plants` WHERE `id` =:id", {
            id,
        }) as PlantRecordResult;
        return result.length === 0 ? null : new PlantRecord(result[0]);
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid()
        }

        await pool.execute("INSERT INTO `plants` VALUES(:id, :name, :lastWatering, :wateringPeriod, :lastFertilization, :fertilizationPeriod, :lastDustRemoval, :quarantine, :image)", {
            id: this.id,
            name: this.name,
            lastWatering: this.lastWatering,
            wateringPeriod: this.wateringPeriod,
            lastFertilization: this.lastFertilization,
            fertilizationPeriod: this.fertilizationPeriod,
            lastDustRemoval: this.lastDustRemoval,
            quarantine: this.quarantine,
            image: this.image,
        });

        return this.id;
    }

    async update(): Promise<void> {
        await pool.execute("UPDATE `plants` SET `name` = :name, `wateringPeriod` = :wateringPeriod, `fertilizationPeriod` = :fertilizationPeriod, `quarantine` = :quarantine, `image` = :image WHERE id = :id", {
            id: this.id,
            name: this.name,
            wateringPeriod: this.wateringPeriod,
            fertilizationPeriod: this.fertilizationPeriod,
            quarantine: this.quarantine,
            image: this.image,
        });
    }

    async water(): Promise<void> {
        await pool.execute("UPDATE `plants` SET `lastWatering` = :lastWatering WHERE id = :id", {
            id: this.id,
            lastWatering: this.lastWatering,
        });
    }

    async fertilize(): Promise<void> {
        await pool.execute("UPDATE `plants` SET `lastFertilization` = :lastFertilization WHERE id = :id", {
            id: this.id,
            lastFertilization: this.lastFertilization,
        });
    }

    async removeDust(): Promise<void> {
        await pool.execute("UPDATE `plants` SET `lastDustRemoval` = :lastDustRemoval WHERE id = :id", {
            id: this.id,
            lastDustRemoval: this.lastDustRemoval,
        });
    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `plants` WHERE `id` = :id", {
            id: this.id,
        });
    }
}