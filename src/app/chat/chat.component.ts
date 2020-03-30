import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private serverUrl = 'http://localhost:8080/socket'
  private stompClient;
  constructor() { }

  sendMessage(userName, countryId, content){
    console.log(userName);
    var message = {"userName": userName, "countryId": countryId, "content": content};
    this.stompClient.send("/app/send/message" , {}, JSON.stringify(message));
    $('#userName').val('');
    $('#countryId').val('');
    $('#content').val('');
  }

  ngOnInit(): void {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/chat", (message) => {
        if(message.body) {
          message = JSON.parse(message.body);
          $(".chat").append("<div class='message'>"+message.userName + " " + message.countryId + " " + message.content + "</div>")
          console.log(message.body);
        }
      });
    });
  }

}
