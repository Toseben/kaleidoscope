/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = THREE.MirrorUVPass = function () {

  THREE.Pass.call( this );

  if ( THREE.MirrorUVShader === undefined )
    console.error( "THREE.MirrorUVPass relies on THREE.MirrorUVShader" );

  var shader = THREE.MirrorUVShader;
  var w, h;

  this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  this.material = new THREE.ShaderMaterial( {

    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader

  } );

  this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
  this.scene  = new THREE.Scene();

  this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
  this.quad.frustumCulled = false; // Avoid getting clipped
  this.scene.add( this.quad );

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
  var uniforms = this.uniforms;

  function onWindowResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    var aspect = w / h;
    if (uniforms) {
      uniforms[ "aspect" ].value = aspect;
    }
  };

  function onMouseMove(event) {
    var xDelta = (event.clientX / w);
    var yDelta = 1.0 - (event.clientY / h);
    uniforms.offset.value.x = xDelta;
    uniforms.offset.value.y = yDelta;
  };

};

THREE.MirrorUVPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

  constructor: THREE.MirrorUVPass,

  render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
    this.uniforms[ "tSize" ].value.set( readBuffer.width, readBuffer.height );
    this.uniforms[ "time" ].value += 0.001;

    this.quad.material = this.material;

    if ( this.renderToScreen ) {

      renderer.render( this.scene, this.camera );

    } else {

      renderer.render( this.scene, this.camera, writeBuffer, this.clear );

    }

  }

} );
