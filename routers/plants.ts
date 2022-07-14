import {Request, Response, Router} from "express";
import multer from 'multer';
import {PlantRecord} from "../records/plant.record";
import {PlantEntity} from "../types";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const plantsRouter = Router();

export const storage = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {callback(null, 'images/')
    },

    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {callback(null, file.originalname)
    }
})

const upload = multer({ storage: storage,  preservePath: true})

plantsRouter
    .post('/add/image', upload.single('file'), function (req, res) {
        res.json({message: 'Successfully uploaded file'})
    })

    .get('/', async (req: Request, res: Response) => {
        const plantList = await PlantRecord.listAll();

        res.json({
            plantList,
        });
    })

    .get('/:id', async (req, res) => {
        const onePlant = await PlantRecord.getOne(req.params.id);
        res.json(onePlant);
    })

    .post('/', async (req, res) => {
        const newPlant = new PlantRecord(req.body as PlantEntity);
        await newPlant.insert();
        res.json(newPlant);
    })

    .patch('/water/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        plant.lastWatering = req.body.lastWatering;

        await plant.water();
        res.json(plant);
    })

    .patch('/fertilize/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        plant.lastFertilization = req.body.lastFertilization;

        await plant.fertilize();
        res.json(plant);
    })

    .patch('/dust/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);

        plant.lastDustRemoval = req.body.lastDustRemoval;

        await plant.removeDust();
        res.json(plant);
    })

    .patch('/edit/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);
        const updatePlant = req.body;
        plant.name = updatePlant.name;
        plant.wateringPeriod = updatePlant.wateringPeriod;
        plant.fertilizationPeriod = updatePlant.fertilizationPeriod;
        plant.image = updatePlant.image;
        plant.quarantine = updatePlant.quarantine;

        await plant.update();
    })

    .delete('/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);
        await plant.delete();
        res.end();
    })