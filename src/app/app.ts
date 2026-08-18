import { Component, effect, OnDestroy, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import the module


interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    styleUrl: './app.css',
    imports: [RouterOutlet, NgClass , FormsModule]
})
export class App implements OnInit{
  list = signal<TodoItem[]>([]);
  inputValue = signal("");

  constructor(){
    effect(() => {
      localStorage.setItem('todoList' , JSON.stringify(this.list()));
    })
  }

  ngOnInit(){
    const data = localStorage.getItem('todoList');

    if(data){
      this.list.set(JSON.parse(data));
    }
  }

  toggleCompleted(id: number): void {
     const todoItem = this.list().find(item => item.id === id);
     if (todoItem) {
       todoItem.completed = !todoItem.completed;
       this.list.update(list => {
        let arr = [];
        for(let i of list){
          if(i.id != id){
            arr.push(i);
          }else{
            arr.push(todoItem);
          }
        }
        return arr;
       })
     }
  }

  addTask(){
    if(this.inputValue() != ''){
      const newTodoItem: TodoItem = {
        id: Date.now(),
        task: this.inputValue().trim(),
        completed: false
       };
      this.list.update(list => [...list , newTodoItem]);
    }
    this.inputValue.set("");

  }

  deleteTask(id: number){
    this.list.update(list => list.filter(item => item.id !== id));
  }
}
