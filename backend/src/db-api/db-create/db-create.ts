import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { IRecipe, ITags } from "../../model/data-model";
import { log } from '../../utility/helpers.ts';
import { db } from '../../services/db.service.ts';
import { CREATE_RECIPE_DATA, CREATE_TAG_DATA } from './sql-create.ts';
import { IResponse } from '../../model/data-model.ts';

const DEBUG = 'db-create | ';

class DBCreate {
    // Recipes
    public static createRecipe = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }
        else {
            const recipeData: IRecipe = req.body;
            let res_code = 200;
            let res_message: IResponse = { completed: true };
            log.info_lv2(`${DEBUG}createRecipe`);

            const data = JSON.stringify(recipeData);
            await db
                .run(CREATE_RECIPE_DATA, `${data}`)
                .catch((err) => {
                    log.error(`${DEBUG}createRecipe - Error: `, err.message);
                    res_code = 500;
                    res_message = { message: 'create failed' };
                });

            res.status(res_code).json(res_message);
        }
    };

    // Tags
    public static createTag = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }
        else {
            const tagData: ITags = req.body;
            let res_code = 200;
            let res_message: IResponse = { completed: true };
            log.info_lv2(`${DEBUG}createTag`);

            await db
                .run(CREATE_TAG_DATA, tagData.type, tagData.tag)
                .catch((err) => {
                    log.error(`${DEBUG}createTag - Error: `, err.message);
                    res_code = 500;
                    res_message = { message: 'create failed' };
                });

            res.status(res_code).json(res_message);
        }
    };

}

export default DBCreate;