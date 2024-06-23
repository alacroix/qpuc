import { Schema, type, MapSchema } from "@colyseus/schema";

export enum ParticipantType {
  Player,
  Host,
  Display,
}

export enum BuzzerState {
  Idle,
  Active,
  Valid,
  Wrong,
  Disabled,
}

export enum GameState {
  WAITING,
  // VIDEO,
  NINE_TO_WIN,
}

export class Question extends Schema {
  @type("string") question: string;
  @type("string") answer: string;
  @type("number") points: number;
}

export class Participant extends Schema {
  @type("string") sessionId: string;
  @type("uint8") type: ParticipantType = ParticipantType.Player;
  @type("string") nickname: string;
  @type("number") points: number = 0;
  @type("boolean") isReady: boolean = false;
  @type("uint8") buzzerState: BuzzerState = BuzzerState.Idle;
}

export class MyRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";

  @type({ map: Participant }) participants = new MapSchema<Participant>();

  @type(Participant) activeParticipant: Participant;

  @type("uint8") gameState: GameState = GameState.WAITING;

  @type(Question) question: Question;
}
