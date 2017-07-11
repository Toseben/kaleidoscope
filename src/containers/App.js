import React, { Component } from 'react'

import 'aframe'
import { Entity, Scene } from 'aframe-react'

import $ from 'jquery'

// Post-processing IMPORT
THREE.EffectComposer = require('../lib/EffectComposer')

THREE.RenderPass = require('../lib/RenderPass');
THREE.ShaderPass = require('../lib/ShaderPass');
THREE.MirrorUVPass = require('../lib/MirrorUVPass');

THREE.CopyShader = require('../lib/CopyShader');
THREE.MirrorUVShader = require('../lib/MirrorUVShader');

require('../effects-system');

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);;
}
`;

const fragmentShader = `
uniform sampler2D texture;
varying vec2 vUv;

void main() {
  vec4 texture = texture2D(texture, vUv, 0.0);

  gl_FragColor = texture;
}
`;

const texPath = "./img/city.jpg";
let effects, uniforms;

var image = document.createElement('img');

// CONTROLS COMPONENT
AFRAME.registerComponent('init-controls', {
  schema: {
    sections: {type: 'int', default: 8}
  },

  init: function() {
    this.effects = document.querySelector('a-scene').systems['effects'];

    if (this.effects) {
      this.effects.composer.passes[1].uniforms.sections.value = this.data.sections;
      effects = this.effects;
      uniforms = this.effects.composer.passes[1].uniforms;
      uniforms.animX.value = 0.25;
      uniforms.animY.value = 0.25;
    }
  },

  update: function() {
    if (this.effects) {
      this.effects.composer.passes[1].uniforms.sections.value = this.data.sections;
    }
  }
});

// SHADER COMPONENT
AFRAME.registerComponent('kaleido-shader', {

  init: function() {
    var entity = this;
    var initTex = new THREE.TextureLoader().load( texPath );

    entity.material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { type: "t", value: initTex}
      },
      vertexShader,
      fragmentShader
    });

    entity.material.side = THREE.DoubleSide;

    var texture = new THREE.Texture(image);
    image.onload = function() {
      texture.needsUpdate = true;
      entity.material.uniforms.texture.value = texture;
    };

    this.applyToMesh();

  },

  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.material = this.material;
    }
  }

});

class App extends Component {

  constructor(props) {
    super(props);
    this.showToggleNav = this.showToggleNav.bind(this);
    this.animToggle = this.animToggle.bind(this);
    this.mouseToggle = this.mouseToggle.bind(this);
    this.changeCounter = this.changeCounter.bind(this);
    this.state = {
      isActive: false,
      animToggle: true,
      mouseToggle: true,
      counter: 6,
      animX: 0.25,
      animY: 0.25
    }
  }

  handleChangeX = (x, y) => {
    this.setState({ animX: y });
    uniforms.animX.value = this.state.animX;
  };

  handleChangeY = (x, y) => {
    this.setState({ animY: y });
    uniforms.animY.value = this.state.animY;
  };

  showToggleNav() {
    this.setState({ isActive: !this.state.isActive });
  }

  animToggle() {
    this.setState({ animToggle: !this.state.animToggle });
    var toggle = !this.state.animToggle ? 1.0 : 0.0;
    uniforms.animSwitch.value = toggle;
  }

  mouseToggle() {
    this.setState({ mouseToggle: !this.state.mouseToggle });
    var toggle = !this.state.mouseToggle ? 1.0 : 0.0;
    uniforms.mouseSwitch.value = toggle;
  }

  changeCounter() {
    let number = this.state.counter === 8 ? 2 : this.state.counter + 1;
    this.setState({ counter: number });
  }

  render() {
    let hamburger = 'hamburger ' + (this.state.isActive ? 'active' : null);
    let animToggle = 'anim-switch-toggle ' + (this.state.animToggle ? 'anim-toggle-on' : null);
    let mouseToggle = 'mouse-switch-toggle ' + (this.state.mouseToggle ? 'anim-toggle-on' : null);
    let animSlider = 'anim-slider ' + (this.state.animToggle ? 'anim-toggle-on' : null);
    let sidenav = {
      width: this.state.isActive ? '25vmin' : '0px',
      minWidth: this.state.isActive ? '150px' : '0px',
      opacity: this.state.isActive ? '1' : '0'
    }

    $('.file-input').change(function(){
      var fileType = this.files[0].name.split('.').pop();
      if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
        var currentEl = $(this).parent().parent().find('.image');
        var reader = new FileReader();
        reader.onload = function (e) {
          currentEl.attr('src', e.target.result);
          image.src = e.target.result;
        };

        reader.readAsDataURL(this.files[0]);
      }
    });

    return (
      <div className='container'>

        {/* HAMBURGER */}
        <div className={hamburger} onClick={this.showToggleNav}>
          <div className='line one'></div>
          <div className='line two'></div>
          <div className='line three'></div>
        </div>

        {/* SIDEBAR */}
        <div className="sidenav" style={sidenav}>

          {/* SLOT 1 */}
          <div className="control">
            <span className="number" onClick={this.changeCounter}>{this.state.counter}</span>
          </div>

          {/* SLOT 2 */}
          <div className="control">
            <div className="anim-switch-wrapper">
              <div className={animToggle} onClick={this.animToggle}>
                <div className="anim-switch-toggle-track">
                  <div className="anim-switch-toggle-target"></div>
                </div>
              </div>
            </div>
            <div className="anim-slider-wrapper">
              <div className={animSlider + " left"}>
                <Slider
                  radius={ 100 }
                  border={ 50 }
                  value={ this.state.animX }
                  onChange={ this.handleChangeX } />
                  <p className="left">X</p>
              </div>
              <div className={animSlider + " right"}>
                <Slider
                  radius={ 100 }
                  border={ 50 }
                  value={ this.state.animY }
                  onChange={ this.handleChangeY } />
                <p className="right">Y</p>
              </div>
            </div>
          </div>

          {/* SLOT 3 */}
          <div className="control">
            <div className="image-container">
              <div className="image-wrapper">
                <img className="image" src={texPath}/>
              </div>
              <button className="file-upload">
                <input type="file" className="file-input"></input>Choose File
              </button>
            </div>
          </div>

          {/* SLOT 4 */}
          <div className="control">
            <div className="anim-switch-wrapper extra-switch-wrapper">
              <div className={mouseToggle} onClick={this.mouseToggle}>
                <div className="anim-switch-toggle-track">
                  <div className="anim-switch-toggle-target"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className='aframe'>
          <Scene init-controls={{sections: this.state.counter}} embedded='true' vr-mode-ui='enabled: false'>
            <a-plane kaleido-shader position="0 0 -1.333" width="10" height="10"></a-plane>
            {/* <a-sphere kaleido-shader position="0 0 -1.333" radius="2"></a-sphere> */}
            <a-sky color="#ff0000"></a-sky>
            <Entity id="camera" className="camera" camera="fov: 150"></Entity>
            {/* <Entity id="camera" className="camera" camera="fov: 150"
              look-controls mouse-cursor wasd-controls>
            </Entity> */}
          </Scene>
        </div>

      </div>
    )
  }
}

class Slider extends Component {
  state = { isPinching: false };

  componentDidMount() {
    this.x = 0
    this.y = 0

    document.addEventListener("mousemove", this.handleMouseMove)
    document.addEventListener("mouseup", this.handleMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove)
    document.removeEventListener("mouseup", this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.setState({ isPinching: false })
  };

  handleMouseDown = (e) => {
    e.preventDefault()

    const { left, top, width, height } = this.potar.getBoundingClientRect()

    this.x = e.pageX - (left + width / 2)
    this.y = (top + height / 2) - e.pageY

    this.setState({ isPinching: true })
  };

  handleMouseMove = (e) => {
    if (this.state.isPinching) {
      const { left, top, width, height } = this.potar.getBoundingClientRect()

      const x = e.pageX - (left + width / 2)
      const y = (top + height / 2) - e.pageY

      const dx = (x - this.x) / 100
      const dy = (y - this.y) / 100

      this.x = x
      this.y = y

      if (this.props.onChange) {
        let xValue = this.props.value + dx
        let yValue = this.props.value + dy

        if (xValue < 0) {
          xValue = 0
        }

        if (xValue > 1) {
          xValue = 1
        }

        if (yValue < 0) {
          yValue = 0
        }

        if (yValue > 1) {
          yValue = 1
        }

        this.props.onChange(xValue, yValue)
      }
    }
  };

  render() {
    const { radius, border, value } = this.props
    const p = 2 * Math.PI * (radius - border / 2)

    const strokeWidth = border
    const strokeDashoffset = p * (1 - value)
    const strokeDasharray = p

    return (
      <svg
        className="slider"
        ref={ (potar) => this.potar = potar }
        viewBox={ `0 0 ${ radius * 2 } ${ radius * 2 }` }
        onMouseDown={ this.handleMouseDown }>
        <circle
          className="slider-circle"
          style={{ strokeWidth }}
          r={ radius - border / 2 }
          cx={ radius }
          cy={ radius } />

        <circle
          className="slider-bar"
          style={{
            strokeWidth,
            strokeDashoffset,
            strokeDasharray,
          }}
          r={ radius - border / 2 }
          cx={ radius }
          cy={ radius } />
      </svg>
    )
  }
}

export default App
