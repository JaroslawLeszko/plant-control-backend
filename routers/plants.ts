import {Request, Response, Router} from "express";
import {PlantRecord} from "../records/plant.record";
import {PlantEntity} from "../types";

export const plantsRouter = Router();

plantsRouter
    .get('/', async (req: Request, res: Response) => {
        const plantList = await PlantRecord.listAll();

        res.json({
            plantList,
        });
    })

    .post('/', async (req, res) => {
        const newPlant = new PlantRecord(req.body as PlantEntity);
        await newPlant.insert();
        res.json(newPlant);
    })

    .patch('/water/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        const lastWater = req.body.lastWatering;
        plant.lastWatering = lastWater;

        await plant.water();
        res.json(plant);
    })

    .patch('/fertilize/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        const lastFertilize = req.body.lastFertilization;
        plant.lastFertilization = lastFertilize;

        await plant.fertilize();
        res.json(plant);
    })

    .patch('/dust/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        const lastDust = req.body.lastDustRemoval;
        plant.lastDustRemoval = lastDust;

        await plant.removeDust();
        res.json(plant);
    })

    .delete('/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);
        await plant.delete();
        res.end();
    })