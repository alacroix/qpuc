import { Schema, type, MapSchema } from "@colyseus/schema";

export enum ParticipantType {
  Player,
  Host,
  Display,
}

export enum GameState {
  WAITING,
  // VIDEO,
  NINE_TO_WIN,
}

export class Participant extends Schema {
  @type("string") sessionId: string;
  @type("uint8") type: ParticipantType = ParticipantType.Player;
  @type("string") nickname: string;
  @type("boolean") isReady: boolean = false;
}

export class MyRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";

  @type({ map: Participant }) participants = new MapSchema<Participant>();

  @type("uint8") gameState: GameState = GameState.WAITING;
}
