import {Request, Response, Router} from "express";
import {PlantRecord} from "../records/plant.record";
import {AddPlant, PlantEntity} from "../types";

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

    .patch('/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        const watPer = req.body.lastWatering;
        plant.lastWatering = watPer;

        await plant.water();
        res.json(plant);
    })

    .delete('/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);
        await plant.delete();
        res.end();
    })