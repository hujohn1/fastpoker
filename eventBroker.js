export default class EventBroker {
    constructor(){
        this.subscribers = {}
    }

    subscribe(eventType, callback){   
        if(!this.subscribers[eventType]){
            this.subscribers[eventType] = []
        }
        this.subscribers[eventType].push(callback)
    }

    publish(eventType, data){
        const subs = this.subscribers[eventType]
        if(subs){
            for(const cb of subs){
                cb(data)
            }
        }
    }
}