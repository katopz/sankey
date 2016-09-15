import React from 'react';
import Button from 'muicss/lib/react/button';

export default class extends React.Component {
  constructor() {
    super()
    
    this.state = {
      name: '' 
    };

    this.handleChange = this.handleChange.bind(this);  
  }
  

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: 'Node' + nextProps.nodes.length
    });
  }


  handleChange(key) {
    return (e) => {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    };
  }


  render() {
    var defaultValue = this.state.name;

    return (
      <div className="input-group">
        <input
          className="form-control"
          value={defaultValue}
          onChange={this.handleChange('name')} 
        />
        <span className="input-group-btn">
          <Button color="primary"
            onClick={this.props.addNode.bind(null, this.state.name)}>
            Add Node
          </Button>
        </span>
      </div>
    );
  }
}
