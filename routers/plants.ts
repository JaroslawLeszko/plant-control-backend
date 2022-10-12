import {Request, Response, Router} from "express";
import multer from 'multer';
import path from "path";
const fs = require('fs');
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

    .get('/getImage/:image', async (req, res) => {
        const imagePath = path.join('/home/jleszkon/domains/jleszko.networkmanager.pl/api/plant-control-backend/plantImages', `${req.params.image}`);

        if (imagePath) {
            res.sendFile(imagePath);
        } else {
            res.sendFile(path.join(__dirname, '../plantImages/defaultImage.png'))
        }
    })

    .post('/add/image', upload.single('file'), async (req, res) => {
        res.json({message: 'Successfully uploaded file'})
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

        if (oldImage !== updatePlant.image)
            plant.image = updatePlant.image;

        plant.name = updatePlant.name;
        plant.wateringPeriod = updatePlant.wateringPeriod;
        plant.fertilizationPeriod = updatePlant.fertilizationPeriod;
        plant.quarantine = updatePlant.quarantine;

        if (oldImage !== updatePlant.image && oldImage !== 'defaultImage.png') {

            await unlinkAsync(`plantImages/${oldImage}`);
        }
        await plant.update();
        res.end();
    })

    .delete('/:id', async (req, res) => {
        const plant = await PlantRecord.getOne(req.params.id);
        const file = plant.image;

        await plant.delete();

        if (file !== 'defaultImage.png') {
            await unlinkAsync(`plantImages/${file}`);
        }
        res.end("Deleting done.");
    })
