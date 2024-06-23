import { Room, Client } from "@colyseus/core";
import {
  BuzzerState,
  GameState,
  MyRoomState,
  Participant,
  ParticipantType,
  Question,
} from "./schema/MyRoomState";
import nineToWinQuestions from "../data/nineToWin.json";

type onJoinOptions = {
  nickname: string;
};

const NUMBERS = "0123456789";

export class MyRoom extends Room<MyRoomState> {
  MY_ROOM = "$myroom";

  generateRoomIdSingle(): string {
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
    }
    return result;
  }

  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.MY_ROOM);
    let id;
    do {
      id = this.generateRoomIdSingle();
    } while (currentIds.includes(id));

    await this.presence.sadd(this.MY_ROOM, id);
    return id;
  }

  async onCreate(options: any) {
    this.roomId = await this.generateRoomId();
    this.setState(new MyRoomState());

    this.onMessage("Lobby:ToggleReadyState", this.onReadyToggle.bind(this));
    this.onMessage(
      "Lobby:UpdatePlayerType",
      this.onPlayerTypeChanged.bind(this),
    );
    this.onMessage("Lobby:StartGame", this.onStartGame.bind(this));
    this.onMessage("Player:Buzzer", this.onPlayerBuzzer.bind(this));
    this.onMessage("NineToWin:HostInput", this.onNineToWinHostInput.bind(this));
  }

  onReadyToggle(client: Client, message: any) {
    const participant = this.state.participants.get(client.sessionId);
    if (participant) {
      participant.isReady = !participant.isReady;
      this.state.participants.set(client.sessionId, participant);
    }
  }

  onPlayerBuzzer(client: Client) {
    if (!this.state.activeParticipant) {
      const participant = this.state.participants.get(client.sessionId);
      if (participant) {
        participant.buzzerState = BuzzerState.Active;
        this.state.activeParticipant = participant;
      }
    }
  }

  resetBuzzers() {
    this.state.participants.forEach((participant, sessionId) => {
      participant.buzzerState = BuzzerState.Idle;
      this.state.participants.set(sessionId, participant);
    });
    this.state.activeParticipant = null;
  }

  onNineToWinHostInput(client: Client, message: any) {
    const host = this.state.participants.get(client.sessionId);
    if (host && host.type === ParticipantType.Host) {
      if (message === "WrongAnswer") {
        this.state.activeParticipant.buzzerState = BuzzerState.Wrong;
        setTimeout(() => {
          this.state.activeParticipant = null;
        }, 100);
      } else {
        if (message === "ValidAnswer") {
          this.state.activeParticipant.buzzerState = BuzzerState.Valid;
          this.state.activeParticipant.points += this.state.question.points;
        }

        setTimeout(this.resetBuzzers.bind(this), 1500);
        setTimeout(this.selectQuestion.bind(this), 1500);
      }
    }
  }

  onPlayerTypeChanged(client: Client, newType: ParticipantType) {
    const participant = this.state.participants.get(client.sessionId);
    if (participant) {
      participant.type = newType;
      this.state.participants.set(client.sessionId, participant);
    }
  }

  selectQuestion() {
    const length = nineToWinQuestions.data.length;
    const index = Math.floor(Math.random() * length);
    const question = nineToWinQuestions.data[index];
    this.state.question = new Question(question);
  }

  onStartGame(client: Client) {
    const participant = this.state.participants.get(client.sessionId);
    if (participant.type === ParticipantType.Host) {
      this.state.gameState = GameState.NINE_TO_WIN;
      this.selectQuestion();
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
    this.presence.srem(this.MY_ROOM, this.roomId);
    console.log("room", this.roomId, "disposing...");
  }
}
