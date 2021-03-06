export default class Component {
    constructor(props) {
        this.___props = props;
        this.___state = undefined;
        this.___prevProps = undefined;
        this.___prevState = undefined;
        this.___updateView = null;
        this.___updateState = null;
        this.___hasChildContext = false;
        this.___initialized = false;

        for (const key of Object.keys(Object.getPrototypeOf(this))) {
            const value = this[key];

            if (typeof value === 'function') {
                this[key] = value.bind(this);
            }
        }
        
        this.___callbackWhenUpdated =
            this.___callbackWhenUpdated.bind(this);
    }

    get props() {
        return this.___props;
    }

    get state() {
        return this.___state;
    }

    set state(state) {
        if (!this.___updateView) {
            this.___state = state;
        } else {
            this.___update(this.___props, state, false);
        }
    }

    get context() {
        return this.___props;
    }

    setState(state) {
        if (!this.___updateView) {
            this.____state = state;
        } else {
            this.___update(this.___props, state, false);
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }

    componentDidCatch(error, info) {
        // TODO!!!
    }

    forceUpdate() {
        if (this.___updateView) {
            this.___update(this.___props, this.___state, true);
        }
    }

    render() {
        return null;
    }

    getChildContext() {
        return null;
    }

    ___init(updateView, updateState) {
        this.___updateView = updateView;
        this.___updateState = updateState;
        updateState(this.___state);
    }

    ___update(nextProps, nextState, force) {
        const needsUpdate =
            force
            || this.shouldComponentUpdate(nextProps, nextState);
        
        if (needsUpdate) {
            this.componentWillUpdate(nextProps, nextState);
        }

        this.___prevProps = this.___props;
        this.___prevState = this.___state;
        this.___props = nextProps;
        this.___state = nextState;

        if (this.___updateState) {
            this.___updateState(nextState);
        }

        if (needsUpdate) {        
            this.___updateView(
                this.render(),
                this.___meta.provides ? this.getChildContext() : null,
                this.___callbackWhenUpdated);
        }
    }
    
    ___callbackWhenUpdated() {
        if (!this.___initialized) {
            this.___initialized = true;
            this.componentDidMount();
        } else {
            this.componentDidUpdate(this.___prevProps, this.___prevState);
        }
    }
}
