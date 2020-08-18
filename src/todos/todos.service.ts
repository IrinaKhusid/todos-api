import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { Todo } from 'src/schemas/todo';
import { CreateTodoDto } from 'src/models/create-todo.dto';
import { TodoResponse } from 'src/models/todo-response.dto';
import { pick } from 'lodash'
import { TodosResponse } from 'src/models/todos-response.dto';
import * as mongoose from 'mongoose';
@Injectable()
export class TodosService {

  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) { }

  async markComplete(entity: TodoResponse): Promise<void> {
    await this.todoModel.updateOne({ _id: entity.id }, { completed: true })
  }
  async markIncomplete(entity: TodoResponse): Promise<void> {
    await this.todoModel.updateOne({ _id: entity.id }, { completed: false })
  }

  async updateProject(id: string, project: string): Promise<void> {
    await this.todoModel.findByIdAndUpdate(id['id'], { project: project })
    // console.log(id.toString());
    // const todo = await this.todoModel.findOne({ _id: id['id'] });
    // console.log({ todo });
    // todo.project = project;
    // await todo.save();
  }

  async updateDueDate(id: string, dueDate: string): Promise<void> {
    await this.todoModel.updateOne({ _id: id['id'] }, { dueDate: dueDate })
  }
  async create(createTodoDto: CreateTodoDto): Promise<TodoResponse> {
    const createdTodo = new this.todoModel(createTodoDto);
    const todo = await createdTodo.save();
    // return this.mapper.map(todo, TodoResponse);
    return this.map(todo);
  }

  async findAll(): Promise<TodoResponse[]> {
    const response = await this.todoModel.find().exec();
    return response.map(this.map);

  }

  private map(todo: Todo): TodoResponse {
    const result = pick(todo, ['id', 'name', 'completed', 'dueDate', 'project']);
    return result as TodoResponse;
  }
}


/*
constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
  */