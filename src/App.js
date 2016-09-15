import React, {Component} from 'react';
import Modal from 'react-modal';

import TopBar from './toolbars/TopBar';
import SankeyChart from './SankeyChart';
import FooterBar from './toolbars/FooterBar';

//import bootstrap from 'bootstrap/dist/css/bootstrap.css'; //118kb
import Button from 'muicss/lib/react/button'; //41kb
import './sankey.css';

import {foo} from './foo';
import {bar} from './bar';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      nodes: [],
      links: [],
      modalIsOpen: false
    };

    this.emptyDiagram = this.emptyDiagram.bind(this);

    this.addNode = this.addNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.addLink = this.addLink.bind(this);
    this.updateLink = this.updateLink.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeAndSaveModal = this.closeAndSaveModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  initNode(nodes, links) {
    nodes.map((node, i) => {
      if (!node.node) { node.node = i; }
      return node
    });

    this.setState({ nodes, links });
  }

  componentDidMount() {
    this.initNode(foo.nodes, foo.links);
  }

  emptyDiagram() {
    this.initNode(bar.nodes.concat(), bar.links.concat());
  }

  addNode(name) {
    var nodes = this.state.nodes;
    var idx = nodes.length;
    name = name || 'Node' + idx
    nodes[idx] = {
      node: idx,
      name
    };

    this.setState({ nodes });
  }

  updateNode(name, idx) {
    var nodes = this.state.nodes;
    nodes[idx]['name'] = name;

    this.setState({ nodes });
  }

  addLink(source, target, value) {
    if (this.state.nodes.length > 1 && !isNaN(value) && !isNaN(source) && !isNaN(target)) {

      var links = this.state.links;
      var idx = links.length;

      links[idx] = { source, target, value };
      this.setState({ links });
    }
  }

  updateLink(source, target, value) {
    var links = this.state.links.map((link) => {
      if (link.source === source && link.target === target) {
        link.value = value;
      }
      return link;
    });

    this.setState({ links });
  }

  openModal(e) {
    if (e.node !== undefined) {
      var modalContent = 'node';
      var modalContentNodeId = e.node;
      var modalContentNodeName = e.name;
    } else if (e.value !== undefined) {
      var modalContent = 'link';
      var modalContentLinkValue = e.value;
      var modalContentLinkSource = e.source.node;
      var modalContentLinkTarget = e.target.node;
    }

    this.setState({
      modalIsOpen: true,
      modalContent,
      modalContentNodeId,
      modalContentNodeName,
      modalContentLinkValue,
      modalContentLinkSource,
      modalContentLinkTarget
    });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeAndSaveModal() {
    if (this.state.modalContent === 'link') {
      this.updateLink(this.state.modalContentLinkSource, this.state.modalContentLinkTarget, this.state.modalContentLinkValue);
    } else if (this.state.modalContent === 'node') {
      this.updateNode(this.state.modalContentNodeName, this.state.modalContentNodeId);
    }
    this.setState({ modalIsOpen: false });
  }

  handleInputChange(key) {
    if (this.state.modalContent === 'link') {
      this.setState({ modalContentLinkValue: key.target.value });
    } else if (this.state.modalContent === 'node') {
      this.setState({ modalContentNodeName: key.target.value });
    }
  }

  render() {
    if (this.state.modalContent === 'link') {
      var modalValue = this.state.modalContentLinkValue;
      var header = 'Update Link Weight';
    } else if (this.state.modalContent === 'node') {
      var modalValue = this.state.modalContentNodeName;
      var header = 'Update Node Name';
    }

    var modalStyle = {
      content: {
        top: '275px',
        left: '37%',
        right: 'auto',
        bottom: 'auto',
        border: '0px solid #333',
        width: '300px',
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0 , 0.35)'
      }
    };

    return (
      <div>
        <TopBar
          nodes={this.state.nodes}
          links={this.state.links}
          addLink={this.addLink}
          addNode={this.addNode}
          openModal ={this.openModal}
          />
        <SankeyChart nodes={this.state.nodes} links={this.state.links} openModal={this.openModal}/>
        <FooterBar
          nodes={this.state.nodes}
          links={this.state.links}
          readFile={this.readFile}
          emptyDiagram={this.emptyDiagram}
          />
        <Modal
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
          style={modalStyle}>
          <Button className="close" onClick={this.closeModal}>
            <span aria-hidden="true">&times; </span>
          </Button>
          <h4>{header}</h4>
          <hr />
          <input
            className="form-control"
            defaultValue={modalValue}
            onChange={this.handleInputChange}
            />
          <hr />
          <div className="row">
            <div className="col-xs-12">
              <Button color="primary" onClick={this.closeAndSaveModal}>Apply Changes</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};
