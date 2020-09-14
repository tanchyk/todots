import express, {Request, Response, NextFunction} from 'express';
import {QueryResult} from "pg";

import {pool} from '../db';

const todoRouter = express.Router();

todoRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const newTodo: QueryResult = await pool.query(`SELECT * FROM todo;`);
        console.log(newTodo.rows);
        return res.status(200).json(newTodo.rows);
    } catch (e) {
        next(e);
        return res.status(500);
    }
});

todoRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const {description}= req.body;
        if(description) {
            await pool.query('INSERT INTO todo (description) VALUES ($1)', [description]);
            return res.status(200).json({
                todo: {
                    description
                }
            });
        } else {
            throw new Error('No description was provided');
        }
    } catch (e) {
        next(e);
        return res.status(500);
    }
});

todoRouter.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const id: number = parseInt(req.params.id);
        const {description}= req.body;
        await pool.query('UPDATE todo SET description = $1 WHERE todo_id = $2', [description, id]);
        return res.status(200).json({
            todo: {
                todo_id: id,
                description
            }
        })
    } catch (e) {
        next(e);
        return res.status(500);
    }
});

todoRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const id: number = parseInt(req.params.id);
        await pool.query('DELETE FROM todo WHERE todo_id = $1', [id]);
        return res.status(200).json({message: `Id ${id} is deleted`});
    } catch (e) {
        next(e);
        return res.status(500);
    }
});

export default todoRouter;