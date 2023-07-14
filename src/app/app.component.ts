import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SocketIOService } from './core/service/socket-io.service';
import { io } from 'socket.io-client';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chat-ui';
  socket: any;
  myForm: FormGroup;
  @ViewChild('container', { static: false }) container: any;
  constructor(private _socketIOService: SocketIOService, private _renderer:Renderer2) {
    this.socket = io('https://connecting-india.onrender.com');
    this.myForm = new FormGroup({
      messageInp: new FormControl('')
    });
  }

  ngOnInit() {
    this._socketIOService.setUpSocketConnection();
    const userName = prompt('Enter your name to join group chat');
    this.socket.emit('new-user-connected', userName);

    this.socket.on('user-joined', (name: any)=> {
      this.append(`${name} joined the Chat.`, 'right')
    })
   
    this.socket.on('receive', (message: any)=> {
      this.append(`${message.user}: ${message.message}`, 'left');
    })

    this.socket.on('left', (user: any)=> {
      this.append(`${user} left the chat.`, 'left')
    });
  }

  onSubmit(form: FormGroup) {
    console.log('Submitted');
    const message = form.value.messageInp;
    this.append(`You: ${message}`, 'right');
    this.socket.emit('send', message);
    form.value.messageInp ='';
  }

  append(message: any, position: any) {
    const messageElement = this._renderer.createElement('div');
    
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    const messageText = messageElement.innerText = message;
    this._renderer.appendChild(this.container.nativeElement, messageElement);
  }
}
