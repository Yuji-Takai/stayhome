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
  private serverUrl = 'https://warm-coast-68258.herokuapp.com//socket'
  private stompClient;
  private counter = 1;
  constructor() { }

  sendMessage(userName, countryId, content){
    if (content.length !== 0 && userName.length !== 0) {
      var message = {"userName": userName, "countryId": countryId, "content": content};
      this.stompClient.send("/app/send/message" , {}, JSON.stringify(message));
      $('#content').val('');
      document.getElementById('error-message-userName').innerHTML = '';
      document.getElementById('error-message-content').innerHTML = '';
    }
    if (userName.length === 0) {
      document.getElementById('error-message-userName').innerHTML = 'Enter your name!';
    }
    if (content.length === 0) {
      document.getElementById('error-message-content').innerHTML = 'Say something!'
    }
  }

  ngOnInit(): void {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/chat", (message) => {
        if(message.body) {   
          $('.userinfo').empty();       
          $(".chat").empty();
          var total_message = JSON.parse(message.body);
          var comments = total_message.comments;
          var countries = total_message.countries;
          var last = comments.length;
          var first = (last - this.counter >= 0) ? last - this.counter : 0;
          for (let i = first; i < last; i++) {
            $('.userinfo').append("<div>" + comments[i].userName + "(" + comments[i].countryId + ")")
            $(".chat").append("<div class='message'>"+ comments[i].content + "</div>");
            
          }
          this.counter++;

          var cum_total = 0;
          var today_total = 0;
          $.each(countries, function(index, country) {
            cum_total += country.cum_total;
            today_total += country.today_total;
          });
          console.log("cummulative total: " + cum_total);
          document.getElementById("cumTotalNumber").innerHTML = "" + cum_total;
          document.getElementById("todayTotalNumber").innerHTML = "" + today_total;
          
        }
      });
    });
  }
}
