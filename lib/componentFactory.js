const sinon = require('sinon');

const ComponentAdapters = {
    'framework:inputfields': require('./fonteva/inputFieldAdapter').inputFieldAdapter,
    'default': instance => instance
}

exports.componentFactory = function componentFactory(params = {}, type = 'default') {
    let instance = new Component(params);
    const adapter = ComponentAdapters[type.toLowerCase()];
    return adapter ? adapter(instance, params) : instance;
}

class Component {
    constructor(params) {
        this.params = Object.assign({}, {
            findMap: {}
        }, params);

        this.getStub = sinon.stub(this, 'get', (name) => {
            return this.params[name] || this.params[name.substring(2)];
        });

        this.setStub = sinon.stub(this, 'set', (name, value) => {
            this.params[name] = value;
        });
    }

    get(name) {
    }
    set(name, value) {
    }

    find(name) {
        const typeOrComponent = this.params.findMap[name];
        if (typeOrComponent instanceof Component) {
            return typeOrComponent;
        }
        return componentFactory(this.params, typeOrComponent);
    }
    getLocalId() {
        return this.params['aura:id'];
    }
}