const EventBroker  = {
    subscribers: {},
    subscribe(eventType, callback){   
        if(!this.subscribers[eventType]){
            this.subscribers[eventType] = []
        }
        this.subscribers[eventType].push(callback)
    },
    sendMessage(eventType, data){
        const subs = this.subscribers[eventType]
        if(subs){
            for(const cb of subs){
                cb(data)
            }
        }
    }
}

export default EventBroker;