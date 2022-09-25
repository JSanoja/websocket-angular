import { Component, OnInit } from "@angular/core";
import { map } from "rxjs";
import { Socket } from 'ngx-socket-io';

@Component({
  selector: "ws-notify",
  templateUrl: "./notify.component.html",
  styleUrls: ["./notify.component.scss"],
})
export class NotifyComponent implements OnInit {
  public Notifications: Array<any> = [];
  public users : any[] = []
  constructor(private socket: Socket) {}
  

  ngOnInit() {
    this.getMessageFromUser().subscribe((msg) => {
      this.pushNotification(msg)
    })
    this.getMessage().subscribe((msg) => {
      this.pushNotification(msg)
    })
    this.getUsers().subscribe((users => {
      console.log(users)
      this.users = users
    }))
    this.socket.on("connect", ()=> {
      this.socket.emit("setUser", "Juan")
      console.log(this.socket)
      setTimeout(()=> {
        this.socket.emit("getUsers", null)
      },1000)
    })
    
    
  }
  pushNotification(msg: any) {
    console.log(msg)
    let index = this.users.map(u => u.id).indexOf(msg.from)
    this.Notifications.push({
      data: msg.msg,
      from: msg.from ? this.users[index].userName : "all",
      time: new Date(Date.now())
    })
  }
  getMessage() {
    return this.socket.fromEvent('notify').pipe(map((data:any) => data));
  }
  getMessageFromUser() {
    return this.socket.fromEvent('notifyFromUser').pipe(map((data:any) => data));
    
  }
  getUsers() {
    return this.socket.fromEvent('getUsers').pipe(map((data:any) => data));
  }
  ping(user:string) {
    this.socket.emit("sendToUser", {id : user, msg : "Test"})
  }

}
