/**
 * Created by ozknemoy on 08.07.2017.
 */
console.log('----------------------');
interface Action {
    type: string;
    payload?: any;
}

interface Reducer<T> {
    (state: T, action: Action): T;
}

let reducer: Reducer<number> = (state: number, action: Action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state; // <-- dont forget!
    }
};

interface ListenerCallback {
    (): void;
}
interface UnsubscribeCallback {
    (): void;
}

class Store<T> {
    private _state: T;
    private _listeners: ListenerCallback[] = [];

    constructor(
        private reducer: Reducer<T>,
        initialState: T
    ) {
        this._state = initialState;
    }

    getState(): T {
        return this._state;
    }

    dispatch(action: Action): void {
        this._state = this.reducer(this._state, action);
        this._listeners.forEach((listener: ListenerCallback) => listener());
    }

    subscribe(listener: ListenerCallback): UnsubscribeCallback {
        this._listeners.push(listener);
        return () => { // returns an "unsubscribe" function
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }
}

let store = new Store<number>(reducer, 0);
console.log(store.getState()); // -> 0

// subscribe
let unsubscribe = store.subscribe(() => {
    console.log('subscribed: ', store.getState());
});

store.dispatch({ type: 'INCREMENT' }); // -> subscribed: 1
store.dispatch({ type: 'INCREMENT' }); // -> subscribed: 2

unsubscribe();
store.dispatch({ type: 'DECREMENT' }); // (nothing logged)

// decrement happened, even though we weren't listening for it
console.log(store.getState()); // -> 1

console.log( Object.assign({},[{1:1}]),typeof JSON.parse(JSON.stringify('1')));
