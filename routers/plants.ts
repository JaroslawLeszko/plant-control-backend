import {Request, Response, Router} from "express";
import multer from 'multer';
import path from "path";
const fs = require('fs/promises');
const { promisify } = require('util')
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
    ): void => {callback(null, 'plantImages/')
    },

    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {callback(null, file.originalname)
    }
})

const upload = multer({ storage: storage,  preservePath: true});

const unlinkAsync = promisify(fs.unlink);

plantsRouter
    .post('/add/image', upload.single('file'), async function (req, res) {
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

    .get('/:image', async (req, res) => {
        const imagePath = path.resolve('../plantImages/', `${req.params.image}`);
        const file = await fs.readFile(imagePath);
        // const file = await fs.readFile(path.join('../plantImages/', req.params.image));
        res.sendFile(file);
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
        const oldImage = plant.image;

        plant.name = updatePlant.name;
        plant.wateringPeriod = updatePlant.wateringPeriod;
        plant.fertilizationPeriod = updatePlant.fertilizationPeriod;
        plant.image = updatePlant.image;
        plant.quarantine = updatePlant.quarantine;

        if (oldImage !== 'defaultImage.png') {
            await unlinkAsync(`plantImages/${oldImage}`);
            plant.image = 'defaultImage.png';
        }

        await plant.update();
        res.end("Updated");
    })

    .delete('/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);
        const file = plant.image;
        if (file !== 'defaultImage.png') {
            await unlinkAsync(`plantImages/${file}`);
        }
        await plant.delete();
        res.end("Deleting done.");
    })
