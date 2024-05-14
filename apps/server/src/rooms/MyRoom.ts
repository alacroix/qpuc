import { Room, Client } from "@colyseus/core";
import {
  MyRoomState,
  Participant,
  ParticipantType,
} from "./schema/MyRoomState";

type onJoinOptions = {
  nickname: string;
};

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

    this.onMessage("Lobby:ToggleReadyState", this.onReadyToggle.bind(this));
    this.onMessage(
      "Lobby:UpdatePlayerType",
      this.onPlayerTypeChanged.bind(this),
    );
  }

  onReadyToggle(client: Client, message: any) {
    const participant = this.state.participants.get(client.sessionId);
    if (participant) {
      participant.isReady = !participant.isReady;
      this.state.participants.set(client.sessionId, participant);
    }
  }

  onPlayerTypeChanged(client: Client, newType: ParticipantType) {
    const participant = this.state.participants.get(client.sessionId);
    if (participant) {
      participant.type = newType;
      this.state.participants.set(client.sessionId, participant);
    }
  }

  onJoin(client: Client, options: onJoinOptions) {
    console.log(`${options.nickname} (${client.sessionId}) joined!`);

    const participant: Participant = new Participant({
      sessionId: client.sessionId,
      nickname: options.nickname,
    });

    this.state.participants.set(client.sessionId, participant);
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(
      `${this.state.participants.get(client.sessionId).nickname} (${client.sessionId}) joined!`,
    );

    this.state.participants.delete(client.sessionId);
    // TODO: implement reconnection
    // try {
    //   if (consented) {
    //     throw new Error("consented leave");
    //   }

    //   // allow disconnected client to reconnect into this room until 30 seconds
    //   await this.allowReconnection(client, 30);
    // } catch (e) {
    //   this.state.participants.delete(client.sessionId);
    // }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
