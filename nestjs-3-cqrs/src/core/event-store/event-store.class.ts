import { TCPClient, EventFactory} from 'geteventstore-promise';
import uuid = require('uuid');

/**
 * @class EventStore
 * @description EventStore.org
 */
export class EventStore {
  // [x: string]: any;
  private type: string;
  private eventFactory: EventFactory;
  private client: TCPClient;

  /**
   * @constructor
   */
  constructor() {
    this.type = 'event-store';
    this.eventFactory = new EventFactory();
  }

  // hostname?: string;
	// port?: number;
	// protocol?: string;
	// gossipSeeds?: GossipSeed[];
	// credentials: UserCredentials;
  // poolOptions?: TCPPoolOptions;
  
  connect(config) {
    this.client = new TCPClient(config);
    return this;
  }

  getClient() {
    return this.client;
  }

  newEvent(name, payload) {
    return this.eventFactory.newEvent(name, payload, {}, uuid.v4());
  }

  close() {
    this.client.close();
    return this;
  }
}