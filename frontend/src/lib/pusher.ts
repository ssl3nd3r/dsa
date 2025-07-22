import Pusher from 'pusher-js';
import {PUSHER_CLUSTER, PUSHER_KEY} from '@/lib/constants';

const pusher = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER
});

export default pusher;